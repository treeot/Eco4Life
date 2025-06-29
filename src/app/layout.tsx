import "./globals.css";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import {Footer} from "@/components/footer";
import {Header} from "@/components/header";
import { AiChat } from "@/components/ai-chat";

const lexend = Lexend({
    subsets: ["latin"],
    weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
    title: "EcoTherapy Wellness Retreats",
    description: "",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${lexend.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}>
            <Header/>
            {children}
            <Footer/>
            <AiChat/>
        </body>
        </html>
    );
}