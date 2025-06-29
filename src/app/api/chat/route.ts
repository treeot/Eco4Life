import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const data = {
            messages: body.messages || [
                {
                    role: "system",
                    content: "You are a helpful AI therapy assistant for EcoTherapy Wellness Retreats. Provide supportive, wellness-focused responses to help users with mental health and wellness questions."
                }
            ],
            model: "llama-3.3-70b-versatile"
        };

        const response = await fetch("https://ai.hackclub.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

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