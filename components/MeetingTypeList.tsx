"use client";
import React, { useState } from "react";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";

const MeetingTypeList = () => {
    const [meeting, setMeeting] = useState<
        | "isScheduleMeeting"
        | "isInstantMeeting"
        | "isJoiningMeeting"
        | undefined
    >();
    const createMeeting = () => {};

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
