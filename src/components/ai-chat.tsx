'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {fetchNearbyParks, getFallbackLocation} from "@/utils/location";
import {LocationCoords, textSearchParameters} from "@/utils/types";

interface Message {
    id: number;
    text: string;
    isBot: boolean;
    isLoading?: boolean;
}

export function AiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi! I'm Sarah, your AI therapy assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [nearbyParks, setNearbyParks] = useState<textSearchParameters[]>([]);
    const [isLocationInitialized, setIsLocationInitialized] = useState(false);


    const initializeLocationData = async () => {
        if (isLocationInitialized) return;

        try {
            let currentLocation: LocationCoords;

            try {
                currentLocation = await new Promise<LocationCoords>((resolve, reject) => {
                    if (!navigator.geolocation) {
                        reject(new Error('Geolocation not supported'));
                        return;
                    }

                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            });
                        },
                        () => reject(new Error('Location denied')),
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
                    );
                });
            } catch {
                currentLocation = await getFallbackLocation();
            }

            setLocation(currentLocation);

            const parks = await fetchNearbyParks(currentLocation.lat, currentLocation.lng);
            setNearbyParks(parks);
        } catch (error) {
            console.warn('Could not initialize location data:', error);
        } finally {
            setIsLocationInitialized(true);
        }
    };

    const getNearbyParksContext = () => {
        if (nearbyParks.length === 0) return '';

        const parksInfo = nearbyParks.slice(0, 5).map((park, index) =>
            `${index + 1}. ${park.name || 'Unnamed location'} (${park.distance || 'distance unknown'})`
        ).join(', ');

        return `Here are nearby parks and nature spots you can recommend to the user: ${parksInfo}. `;
    };

    const sendToAI = async (userMessage: string) => {
        setIsLoading(true);

        if (!isLocationInitialized) {
            await initializeLocationData();
        }

        const nearbyParksInfo = getNearbyParksContext();
        const locationContext = location && nearbyParksInfo
            ? `\nSuggest nearby nature spots, parks, or outdoor activities when appropriate. ${nearbyParksInfo}`
            : '';

        const conversationMessages = [
            {
                "role": "system",
                "content": "Your name is Sarah. You are a compassionate and calming AI assistant designed for EcoTherapy Wellness Retreats. Your should support users on their mental health and wellness journeys, especially those feeling overwhelmed and isolated. Use short, soothing messages to provide emotional validation, encouragement, and motivation to help users heal. You are not a medical professional and should never diagnose or offer clinical advice. Your focus is offering empathy, self-care tips, and supportive language that reminds users they are not alone.\n" +
                    "Your responses should be brief (1–3 sentences), comforting, and easy to understand. Speak like a supportive friend or counselor. Be warm, nonjudgmental, and nurturing. Suggest wellness practices such as stepping outside, mindfulness, or visiting a local garden or park (When appropriate). Avoid overwhelming them with too much information at once. Instead, offer one calm, thoughtful idea at a time.\n" +
                    "Above all, your goal is to gently help users reconnect with themselves, others, and the natural world, reminding them that even small steps toward healing are worth celebrating. Always remind users to seek professional help if they are in distress or need urgent assistance." + locationContext
            },
            ...messages.map(msg => ({
                "role": msg.isBot ? "assistant" : "user",
                "content": msg.text
            })),
            {
                "role": "user",
                "content": userMessage
            }
        ];

        const data = {
            "messages": conversationMessages,
            "model": "llama-3.3-70b-versatile"
        };

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            const aiResponse = result.message

            const botMessage: Message = {
                id: Date.now() + 1,
                text: aiResponse,
                isBot: true
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                isBot: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now(), text: input, isBot: false };
        setMessages(prev => [...prev, userMessage]);

        const userInput = input;
        setInput('');

        sendToAI(userInput);
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#94e0b2] text-[#121714] shadow-lg hover:bg-[#7dd19a] transition-colors"
                    aria-label="Open AI Chat"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl flex flex-col transition-colors">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#2b362f]">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Sarah</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                        message.isBot
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors'
                                            : 'bg-[#94e0b2] text-[#121714]'
                                    }`}
                                >
                                    {message.isBot ? (
                                        <div className="prose prose-sm max-w-none dark:prose-invert">
                                            <ReactMarkdown>
                                                {message.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        message.text
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white max-w-[80%] p-3 rounded-lg text-sm transition-colors">                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#94e0b2] bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm disabled:opacity-50 transition-colors"                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="px-3 py-2 bg-[#94e0b2] text-[#121714] rounded-md hover:bg-[#7dd19a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}