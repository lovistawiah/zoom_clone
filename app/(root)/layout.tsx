import StreamVideoProvider from "@/Providers/StreamClient";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Yoom - Video call app",
    description:
        "Yoom is a video call app that allows you to call your friends and family.",
    icons: {
        icon: "/icons/logo.svg",
    },
};
const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <StreamVideoProvider>{children}</StreamVideoProvider>
        </main>
    );
};

export default RootLayout;
