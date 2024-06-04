"use client";
import React, { useState } from "react";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";

const MeetingTypeList = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [meeting, setMeeting] = useState<
        | "isScheduleMeeting"
        | "isInstantMeeting"
        | "isJoiningMeeting"
        | undefined
    >();
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [value, setValue] = useState({
        dateTime: new Date(),
        description: "",
        link: "",
    });
    const [callDetails, setCallDetails] = useState<Call>();

    const createMeeting = async () => {
        if (!client || !user) return;
        try {
            if (!value.dateTime) {
                toast({
                    title: "Please select a date and time",
                });
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call("default", id);

            if (!call) throw new Error("Failed to create call");

            const startsAt =
                value.dateTime.toISOString() ||
                new Date(Date.now()).toISOString();

            const description = value.description || "Instant Meeting";

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description: description,
                    },
                },
            });

            setCallDetails(call);

            if (!value.description) {
                router.push(`/meeting/${call.id}`);
            }
            toast({
                title: "Meeting created",
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "Failed to create meeting",
            });
        }
    };

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard
                img="/icons/add-meeting.svg"
                title="New Meeting"
                description="Start an instant meeting"
                handleClick={() => setMeeting("isInstantMeeting")}
                className="bg-orange-1"
            />
            <HomeCard
                img="/icons/schedule.svg"
                title="Schedule Meeting"
                description="Plan your meeting"
                handleClick={() => setMeeting("isScheduleMeeting")}
                className="bg-blue-1"
            />
            <HomeCard
                img="/icons/recordings.svg"
                title="View Recordings"
                description="Check your recordings"
                handleClick={() => setMeeting("isJoiningMeeting")}
                className="bg-purple-1"
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Join Meeting"
                description="via invitation link"
                handleClick={() => setMeeting("isJoiningMeeting")}
                className="bg-yellow-1"
            />
            <MeetingModal
                isOpen={meeting === "isInstantMeeting"}
                onClose={() => setMeeting(undefined)}
                title="Start Instant Meeting"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />
        </section>
    );
};

export default MeetingTypeList;
