//@ts-nocheck
"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "./ui/use-toast";

const CallList = ({ type }: { type: "ended" | "recordings" | "upcoming" }) => {
    const [recordings, setRecordings] = useState<CallRecording[]>([]);
    const { upcomingCalls, callRecordings, endedCalls, isLoading } =
        useGetCalls();
    const router = useRouter();
    const { toast } = useToast();

    const getCalls = () => {
        switch (type) {
            case "ended":
                return endedCalls;
            case "recordings":
                return recordings;
            case "upcoming":
                return upcomingCalls;
            default:
                return [];
        }
    };
    const getNoCallsMessage = () => {
        switch (type) {
            case "ended":
                return "No Previous Calls";
            case "recordings":
                return "No Recordings";
            case "upcoming":
                return "No Upcoming Calls";
            default:
                return "";
        }
    };

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const callData = await Promise.all(
                    callRecordings.map((meeting) => meeting.queryRecordings())
                );
                const recordings = callData
                    .filter((call) => call.recordings.length > 0)
                    .flatMap((call) => call.recordings);

                setRecordings(recordings);
            } catch (error) {
                toast({ titlle: "Try again later" });
            }
        };
        if (type === "recordings") fetchRecordings();
    }, [type, callRecordings]);
    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    if (isLoading) return <Loader />;
    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {calls && calls.length > 0 ? (
                calls?.map((meeting: Call | CallRecording) => (
                    <MeetingCard
                        key={(meeting as Call).id}
                        title={
                            (meeting as Call).state?.custom.description ||
                            meeting.filename.substring(0, 20) ||
                            "No description"
                        }
                        date={
                            meeting.state?.startsAt.toLocaleString() ||
                            meeting.start_time.toLocaleString()
                        }
                        icon={
                            type === "upcoming"
                                ? "/icons/upcoming.svg"
                                : type === "ended"
                                ? "/icons/previous.svg"
                                : "/icons/recordings.svg"
                        }
                        isPreviousMeeting={type === "ended"}
                        buttonIcon1={
                            type === "recordings"
                                ? "/icons/play.svg"
                                : undefined
                        }
                        buttonText={type === "recordings" ? "Play" : "Start"}
                        handleClick={
                            type === "recordings"
                                ? () => router.push(`${meeting.url}`)
                                : () => router.push(`/meeting/${meeting.id}`)
                        }
                        link={
                            type === "recordings"
                                ? meeting.url
                                : `${
                                      process.env.NEXT_PUBLIC_BASE_URL
                                  }/meeting/${(meeting as Call).id}`
                        }
                    />
                ))
            ) : (
                <h1>{noCallsMessage}</h1>
            )}
        </div>
    );
};

export default CallList;
