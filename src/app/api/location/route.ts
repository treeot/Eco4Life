import { NextResponse } from 'next/server';

interface IPInfoResponse {
    ip: string;
    city: string;
    region: string;
    country: string;
    loc: string; // "lat,lng" format
    org: string;
    postal: string;
    timezone: string;
}

interface IPApiResponse {
    lat: number;
    lon: number;
    city: string;
    region: string;
    country: string;
    status: string;
}

// Interface for the response from the FreeGeoIP API
interface FreeGeoIPResponse {
    latitude: number;      // Latitude of the detected IP location
    longitude: number;     // Longitude of the detected IP location
    city: string;          // City name
    region_name: string;   // Region or state name
    country_name: string;  // Country name
}

// Helper function to determine if an IP address is local/private
function isLocalIP(ip: string): boolean {
    // Remove IPv6-mapped IPv4 prefix if present
    const cleanIP = ip.replace(/^::ffff:/, '');

    // Check for localhost or loopback addresses
    if (cleanIP === '127.0.0.1' || cleanIP === '::1' || cleanIP === 'localhost') {
        return true;
    }

    // Split the IP into its octets for further checks
    const parts = cleanIP.split('.').map(Number);
    if (parts.length !== 4) return false;

    // Check for private IP address ranges
    if (parts[0] === 10) return true; // 10.0.0.0/8
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12
    if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16

    return false;
}

// Attempt to get geolocation info from ipinfo.io for a given client IP
async function tryIPInfo(clientIP: string) {
    const response = await fetch(
        `https://ipinfo.io/${clientIP}/json?token=${process.env.IPINFO_TOKEN}`,
        {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(5000)
        }
    );

    if (!response.ok) throw new Error('IPInfo failed');

    const data: IPInfoResponse = await response.json();
    const [lat, lng] = data.loc.split(',').map(Number);

    return {
        lat,
        lng,
        accuracy: 50000,
        city: data.city,
        region: data.region,
        country: data.country,
        source: 'ipinfo.io'
    };
}

async function tryIPApi(clientIP: string) {
    const response = await fetch(`http://ip-api.com/json/${clientIP}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) throw new Error('IP-API failed');

    const data: IPApiResponse = await response.json();

    if (data.status !== 'success') throw new Error('IP-API returned failure status');

    return {
        lat: data.lat,
        lng: data.lon,
        accuracy: 60000,
        city: data.city,
        region: data.region,
        country: data.country,
        source: 'ip-api.com'
    };
}

async function tryFreeGeoIP(clientIP: string) {
    const response = await fetch(`https://freegeoip.app/json/${clientIP}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) throw new Error('FreeGeoIP failed');

    const data: FreeGeoIPResponse = await response.json();

    return {
        lat: data.latitude,
        lng: data.longitude,
        accuracy: 70000,
        city: data.city,
        region: data.region_name,
        country: data.country_name,
        source: 'freegeoip.app'
    };
}

export async function GET(request: Request) {
    try {
        const forwarded = request.headers.get('x-forwarded-for');
        const clientIP = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '8.8.8.8';

        if (isLocalIP(clientIP)) {
            return NextResponse.json({
                lat: 0,
                lng: 0,
                accuracy: 0,
                message: 'Local IP detected, cannot determine location',
                error: true
            }, { status: 200 });
        }

        const apis = [tryIPInfo, tryIPApi, tryFreeGeoIP];

        for (const apiCall of apis) {
            try {
                const result = await apiCall(clientIP);

                // Validate coordinates
                if (result.lat !== 0 && result.lng !== 0 &&
                    Math.abs(result.lat) <= 90 && Math.abs(result.lng) <= 180) {
                    return NextResponse.json(result);
                }
            } catch (error) {
                console.warn(`API failed: ${error}`);
                continue;
            }
        }

        return NextResponse.json({
            lat: 0,
            lng: 0,
            accuracy: 0,
            message: 'All location services unavailable',
            error: true
        }, { status: 200 });

    } catch {
        return NextResponse.json({
            lat: 0,
            lng: 0,
            accuracy: 0,
            message: 'Failed to get IP geolocation',
            error: true
        }, { status: 200 });
    }
}