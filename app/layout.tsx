import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Yoom - Video call app",
    description:
        "Yoom is a video call app that allows you to call your friends and family.",
    icons: {
        icon: "/icons/logo.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <ClerkProvider
                appearance={{
                    layout: {
                        logoImageUrl: "/icons/yoom-logo.svg",
                        socialButtonsVariant: "iconButton",
                    },
                    variables: {
                        colorText: "#fff",
                        colorPrimary: "#0E78F9",
                        colorBackground: "#1C1F2E",
                        colorInputBackground: "#252A41",
                        colorInputText: "#fff",
                    },
                }}
            >
                <body className={`${inter.className} bg-dark-2`}>
                    {children}
                    <Toaster />
                </body>
            </ClerkProvider>
        </html>
    );
}
