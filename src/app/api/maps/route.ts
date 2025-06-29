import {calculateRoute} from "@/lib/utils";
import {textSearchParameters} from "@/utils/types";

interface Place {
    displayName?: { text: string };
    formattedAddress?: string;
    location: { latitude: number; longitude: number };
    priceLevel?: string;
    photos?: Array<{ name: string }>;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const userLat = parseFloat(searchParams.get('lat') || '0');
    const userLng = parseFloat(searchParams.get('lng') || '0');

    console.log(`${query} near ${userLat}, ${userLng}`);
    if (!query) {
        return Response.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY || '',
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,' +
                    'places.photos,places.location',
            },
            body: JSON.stringify({
                textQuery: `${query}`,
                locationBias: {
                    circle: {
                        center: {
                            latitude: userLat,
                            longitude: userLng
                        },
                        radius: 5000
                    }
                },
                maxResultCount: 20
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const places = await Promise.all(data.places?.map(async (place: Place) => {
            const textSearch: textSearchParameters = {
                name: place.displayName?.text ?? '',
                address: place.formattedAddress ?? '',
                latitude: place.location.latitude ?? 0,
                longitude: place.location.longitude ?? 0,
                priceLevel: place.priceLevel?.toString().replace('PRICE_LEVEL_', '') ?? 'FREE',
                photos: place.photos?.[0]?.name ?? '',
            }
            const route = await calculateRoute(textSearch, userLat, userLng);

            return {
                name: place.displayName?.text ?? '',
                address: place.formattedAddress ?? '',
                latitude: place.location.latitude ?? 0,
                longitude: place.location.longitude ?? 0,
                priceLevel: place.priceLevel?.toString().replace('PRICE_LEVEL_', '') ?? 'FREE',
                photos: place.photos?.[0]?.name ?? '',
                distance: route.distance,
                duration: route.duration,
                polyline: route.polyline,
            }
        }) || []);

        return Response.json(places);
    } catch {

    }
}