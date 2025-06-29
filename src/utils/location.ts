import {textSearchParameters} from "@/utils/types";

interface LocationCoords {
    lat: number;
    lng: number;
}

export const getFallbackLocation = async (
    setLocationError?: (error: string) => void
): Promise<LocationCoords> => {
    try {
        const response = await fetch('/api/location');
        const data = await response.json();

        if (data.error || data.message) {
            console.warn('Location API warning:', data.message);
            const errorMessage = data.message || 'Unable to get accurate location';
            if (setLocationError) {
                setLocationError(errorMessage);
            }
        }

        return { lat: data.lat, lng: data.lng };
    } catch {
        const errorMessage = 'Failed to get your location. Please enable location services or try again later.';
        if (setLocationError) {
            setLocationError(errorMessage);
        }
        throw new Error(errorMessage);
    }
};

export const fetchNearbyLocations = async (
    lat: number,
    lng: number
): Promise<textSearchParameters[]> => {
    try {
        const query = encodeURIComponent('parks,gardens,forests');
        const placesResponse = await fetch(`/api/maps?q=${query}&lat=${lat}&lng=${lng}`);

        if (!placesResponse.ok) {
            throw new Error(`HTTP error! status: ${placesResponse.status}`);
        }

        const contentType = placesResponse.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            throw new Error('Response is not JSON');
        }

        const placesData: textSearchParameters[] = await placesResponse.json();
        const sortedPlaces = placesData.sort((a, b) => {
            const distanceA = parseFloat(a.distance?.toString().replace(/[^\d.]/g, '') || '0');
            const distanceB = parseFloat(b.distance?.toString().replace(/[^\d.]/g, '') || '0');
            return distanceA - distanceB;
        });

        return sortedPlaces;
    } catch (error) {
        console.error('Failed to fetch nearby parks:', error);
        throw error;
    }
};