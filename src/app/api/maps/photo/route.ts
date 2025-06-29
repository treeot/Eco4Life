import { NextRequest, NextResponse } from 'next/server';

// API route handler for fetching a Google Places photo by reference
export async function GET(request: NextRequest) {
    // Extract query parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const photoReference = searchParams.get('photo'); // Google Places photo reference string
    const returnUrl = searchParams.get('returnUrl');   // Optional: if 'true', return only the image URL

    // If no photo reference is provided, return a 400 error
    if (!photoReference) {
        return NextResponse.json({ error: 'Photo reference required' }, { status: 400 });
    }

    try {
        // Request the photo from Google Places API using the provided reference
        const response = await fetch(
            `https://places.googleapis.com/v1/${photoReference}/media?key=${process.env.GOOGLE_MAPS_API_KEY}&maxWidthPx=400`,
            { redirect: 'manual' } // Prevent automatic redirects so we can handle them manually
        );

        // If Google responds with a redirect (301/302), handle accordingly
        if (response.status === 302 || response.status === 301) {
            const redirectUrl = response.headers.get('location'); // The actual image URL

            if (returnUrl === 'true') {
                // If returnUrl is requested, return the image URL as JSON
                return NextResponse.json({ url: redirectUrl });
            }

            // Otherwise, fetch the image and return it as a binary response
            const imageResponse = await fetch(redirectUrl!);
            const imageBuffer = await imageResponse.arrayBuffer();
            const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

            return new NextResponse(imageBuffer, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=86400',
                    'X-Image-Url': redirectUrl!,
                },
            });
        }

        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }
}