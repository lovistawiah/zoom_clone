"use client";
import React, { useState } from "react";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";

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

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

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
                handleClick={() => router.push("/recordings")}
                className="bg-purple-1"
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Join Meeting"
                description="via invitation link"
                handleClick={() => setMeeting("isJoiningMeeting")}
                className="bg-yellow-1"
            />
            {!callDetails ? (
                <MeetingModal
                    isOpen={meeting === "isScheduleMeeting"}
                    onClose={() => setMeeting(undefined)}
                    title="Create Meeting"
                    handleClick={createMeeting}
                >
                    <div className="flex flex-col gap-2 5">
                        <label className="text-base text-normal leading-[22px] text-sky-2">
                            Add a description
                        </label>
                        <Textarea
                            className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                            onChange={(e) =>
                                setValue({
                                    ...value,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex w-full flex-col gap-2 5">
                        <label className="text-base text-normal leading-[22px] text-sky-2">
                            Select date and time
                        </label>
                        <ReactDatePicker
                            selected={value.dateTime}
                            onChange={(date) => {
                                setValue({
                                    ...value,
                                    dateTime: date!,
                                });
                            }}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat={"MMMM d, yyyy h:mm aa"}
                            className=" bg-dark-3 w-full rounded p-2 focus:outline-none"
                        />
                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal
                    isOpen={meeting === "isScheduleMeeting"}
                    onClose={() => setMeeting(undefined)}
                    title="Meeting Created"
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                        toast({
                            title: "Meeting Link Copied",
                        });
                    }}
                    image="/icons/checked.svg"
                    buttonIcon="/icons/copy.svg"
                    buttonText="Copy Meeting Link"
                />
            )}
            <MeetingModal
                isOpen={meeting === "isInstantMeeting"}
                onClose={() => setMeeting(undefined)}
                title="Start Instant Meeting"
                buttonText="Start Meeting"
                className="text-center"
                handleClick={createMeeting}
            />
            <MeetingModal
                isOpen={meeting === "isJoiningMeeting"}
                onClose={() => setMeeting(undefined)}
                title="Type Link here"
                buttonText="Join Meeting"
                className="text-center"
                handleClick={createMeeting}
            >
                <Input
                    className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Meeting Link"
                    onChange={(e) =>
                        setValue({ ...value, link: e.target.value })
                    }
                />
            </MeetingModal>
        </section>
    );
};

export default MeetingTypeList;
