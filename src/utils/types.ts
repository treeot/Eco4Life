export interface LocationCoords {
    lat: number;
    lng: number;
}

export interface textSearchParameters {
    id?: string;
    name: string;
    latitude: number;
    longitude: number;
    address?: string;
    priceLevel?: string;
    photos?: string;
    distance?: number;
    duration?: string;
    polyline?: string;
}
