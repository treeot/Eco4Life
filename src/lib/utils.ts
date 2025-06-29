import {textSearchParameters} from "@/utils/types";

interface GoogleRoutesResponse {
    routes?: Array<{
        distanceMeters: number;
        duration: string;
        polyline: {
            encodedPolyline: string;
        };
    }>;
}

export interface routeParameters {
    distance: number;
    duration: string;
    polyline: string;
}

export async function calculateRoute(
    place: textSearchParameters,
    userLat: number,
    userLng: number
): Promise<routeParameters> {
    const response: Response = await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY || '',
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
        },
        body: JSON.stringify({
            origin: {
                location: {
                    latLng: {
                        latitude: userLat,
                        longitude: userLng,
                    }
                }
            },
            destination: {
                location: {
                    latLng: {
                        latitude: place.latitude,
                        longitude: place.longitude,
                    }
                }
            },
            travelMode: 'WALK',
        }),
    });

    const data: GoogleRoutesResponse = await response.json();
    const result = data.routes?.[0];

    if (!result) {
        throw new Error('No route found');
    }

    return {
        distance: result.distanceMeters,
        duration: result.duration,
        polyline: result.polyline.encodedPolyline,
    };
}

export function formatDuration(seconds: number | string | undefined): string {
    if (seconds === undefined || seconds === null) {
        return 'Unknown';
    }

    const numSeconds = typeof seconds === 'string' ? parseInt(seconds, 10) : seconds;

    if (isNaN(numSeconds) || numSeconds < 0) {
        return 'Unknown';
    }

    if (numSeconds < 60) {
        return `${Math.round(numSeconds)}s`;
    }

    if (numSeconds < 3600) {
        const minutes = Math.round(numSeconds / 60);
        return `${minutes}m`;
    }

    const hours = Math.floor(numSeconds / 3600);
    const remainingMinutes = Math.round((numSeconds % 3600) / 60);

    if (remainingMinutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
}
