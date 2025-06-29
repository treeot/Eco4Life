export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const originLat = searchParams.get('originLat');
    const originLng = searchParams.get('originLng');
    const destLat = searchParams.get('destLat');
    const destLng = searchParams.get('destLng');

    if (!originLat || !originLng || !destLat || !destLng) {
        return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const iframeHtml = `
        <iframe
            src="https://www.google.com/maps/embed/v1/directions?key=${process.env.GOOGLE_MAPS_API_KEY}&origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=walking"
            width="100%"
            height="100%"
            style="border: 0; border-radius: 5px;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    `;

    return new Response(iframeHtml, {
        headers: {
            'Content-Type': 'text/html',
        },
    });
}