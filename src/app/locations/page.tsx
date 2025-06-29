'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {fetchNearbyLocations, getFallbackLocation} from "@/utils/location";
import { textSearchParameters } from '@/utils/types';
import {formatDuration} from "@/lib/utils";

export default function GoogleMapWithUserStart() {
    const [locationStatus, setLocationStatus] = useState<'requesting' | 'granted' | 'denied' | 'error'>('requesting');
    const [places, setPlaces] = useState<textSearchParameters[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<textSearchParameters | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [locationSource, setLocationSource] = useState<'browser' | 'fallback' | null>(null);

    const placesPerPage = 9;
    const totalPages = Math.ceil(places.length / placesPerPage);
    const startIndex = (currentPage - 1) * placesPerPage;
    const endIndex = startIndex + placesPerPage;
    const currentPlaces = places.slice(startIndex, endIndex);

    const getUserLocationFromBrowser = (): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve, reject) => {
            // Check if the browser supports geolocation
            if (!navigator.geolocation) {
                // If not supported, reject the promise with an error
                reject(new Error('Geolocation not supported'));
                return;
            }

            // Request the user's current position
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // On success, update status and resolve with coordinates
                    setLocationStatus('granted');
                    resolve({
                        lat: position.coords.latitude, // Latitude from geolocation
                        lng: position.coords.longitude // Longitude from geolocation
                    });
                },
                () => {
                    // On error (e.g., user denies), update status and reject
                    setLocationStatus('denied');
                    reject(new Error('Location denied'));
                },
                {
                    enableHighAccuracy: true, // Request high accuracy if possible
                    timeout: 10000,           // Wait up to 10 seconds
                    maximumAge: 60000         // Accept a cached position up to 1 minute old
                }
            );
        });
    };

    // Open the map modal for a selected place
    const openMapModal = (place: textSearchParameters) => {
        setSelectedPlace(place);
    };

    // Close the map modal
    const closeMapModal = () => {
        setSelectedPlace(null);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        const initData = async () => {
            let location: { lat: number; lng: number };

            try {
                location = await getUserLocationFromBrowser();
                setLocationSource('browser');

            } catch {
                location = await getFallbackLocation();
                setLocationSource('fallback');
            }

            setUserLocation(location);

            const sortedPlaces = await fetchNearbyLocations(location.lat, location.lng);
            setPlaces(sortedPlaces);
            setCurrentPage(1);
        };

        initData();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Path from Your Location
                </h2>

                {locationStatus === 'requesting' && (
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
                        <p className="text-blue-800 dark:text-blue-200">Requesting location permission...</p>
                    </div>
                )}

                {locationSource === 'browser' && (
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
                        <p className="text-green-800 dark:text-green-200">✓ Using precise location from your device</p>
                    </div>
                )}

                {locationSource === 'fallback' && (
                    <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg p-4 mb-6">
                        <p className="text-orange-800 dark:text-orange-200">⚠ Using approximate location based on IP address</p>
                    </div>
                )}

                {locationStatus === 'denied' && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
                        <p className="text-red-800 dark:text-red-200">Location access denied. Using approximate location based on IP.</p>
                    </div>
                )}

                {userLocation && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Found:</span> {places.length} places
                            </p>
                        </div>

                        {places.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Places found (Page {currentPage} of {totalPages})
                                </h3>
                                <div className="flex justify-center items-center gap-2 mb-6">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        const isActive = currentPage === page;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`px-3 py-2 rounded-lg border min-w-[40px] transition-all duration-200 ${
                                                    isActive 
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                    {currentPlaces.map((place, index) => {
                                        return (
                                            <div
                                                key={startIndex + index}
                                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105"
                                                onClick={() => openMapModal(place)}
                                            >
                                                {place.photos && (
                                                    <div className="relative h-48 w-full">
                                                        <Image
                                                            src={`/api/maps/photo?photo=${encodeURIComponent(place.photos)}`}
                                                            alt={place.name}
                                                            fill
                                                            className="object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                        {place.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        <span className="font-medium">Location:</span> {place.latitude.toFixed(2)}, {place.longitude.toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="font-medium">Distance:</span> {place.distance}m | <span className="font-medium">Duration:</span> {formatDuration(place.duration as string)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="text-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Showing {startIndex + 1}-{Math.min(endIndex, places.length)} of {places.length} places
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {selectedPlace && userLocation && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] relative border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={closeMapModal}
                                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 z-10 transition-all duration-200 hover:scale-110"
                            >
                                ×
                            </button>
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {selectedPlace.name}
                                </h3>
                            </div>
                            <div className="h-[calc(100%-80px)]">
                                <iframe
                                    src={`/api/maps/directions?originLat=${userLocation.lat}&originLng=${userLocation.lng}&destLat=${selectedPlace.latitude}&destLng=${selectedPlace.longitude}`}
                                    className="w-full h-full rounded-b-xl"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}