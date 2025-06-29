// API route handler for generating a Google Maps directions iframe
export async function GET(request: Request) {
    // Parse query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const originLat = searchParams.get('originLat'); // Latitude of the origin point
    const originLng = searchParams.get('originLng'); // Longitude of the origin point
    const destLat = searchParams.get('destLat');     // Latitude of the destination point
    const destLng = searchParams.get('destLng');     // Longitude of the destination point

    // Validate that all required parameters are present
    if (!originLat || !originLng || !destLat || !destLng) {
        // Return a 400 error if any parameter is missing
        return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Construct the HTML for an embedded Google Maps directions iframe
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

    // Return the iframe HTML as the response with the correct content type
    return new Response(iframeHtml, {
        headers: {
            'Content-Type': 'text/html',
        },
    });
}