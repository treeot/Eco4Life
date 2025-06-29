import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Prepare the data payload for the AI chat API
        const data = {
            messages: body.messages || [
                {
                    role: "system",
                    content: "You are a helpful AI therapy assistant for EcoTherapy Wellness Retreats. Provide supportive, wellness-focused responses to help users with mental health and wellness questions."
                }
            ],
            model: "llama-3.3-70b-versatile" // Specify the AI model to use
        };

        // Send a POST request to the external AI chat API
        const response = await fetch("https://ai.hackclub.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // If the response is not OK, throw an error
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Return the AI's response as a JSON object to the client
        return NextResponse.json({
            message: result.choices[0].message.content,
            success: true
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to get AI response',
                success: false
            },
            { status: 500 }
        );
    }
}