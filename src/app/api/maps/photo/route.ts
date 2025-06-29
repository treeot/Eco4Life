import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const photoReference = searchParams.get('photo');
    const returnUrl = searchParams.get('returnUrl');

    if (!photoReference) {
        return NextResponse.json({ error: 'Photo reference required' }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://places.googleapis.com/v1/${photoReference}/media?key=${process.env.GOOGLE_MAPS_API_KEY}&maxWidthPx=400`,
            { redirect: 'manual' }
        );

        if (response.status === 302 || response.status === 301) {
            const redirectUrl = response.headers.get('location');

            if (returnUrl === 'true') {
                return NextResponse.json({ url: redirectUrl });
            }

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