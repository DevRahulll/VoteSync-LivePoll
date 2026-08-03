import { Schema } from "mongoose";
import mongoose from "mongoose";

export interface IPoll {
    pollName: string;
    pollDescription: string;
    pollDurationInMin: number;
    pollStartTime: Date | null;
    pollEndTime: Date | null;
    isAnonymousAllowed: boolean;
    shareCode: string;
    analyticsCode: string;
    isResultPublished: boolean;
    status: "draft" | "active" | "ended";
    totalVotes: number;
    totalParticipants: number;
    createdBy: mongoose.Types.ObjectId;
}

interface IOption {
    text: string;
    order: number;
    votes: number;
}

export interface IQuestion {
    question: string;
    pollId: mongoose.Types.ObjectId;
    questionNumber: number;
    isRequired: boolean;
    options: IOption[];
    createdAt: Date;
    updatedAt: Date;
}

const pollSchema: Schema = new Schema<IPoll>(
    {
        pollName: {
            type: String,
            required: [true, "PollName is required"],
        },
        pollDescription: {
            type: String,
            required: [true, "PollDescription is required"],
        },
        pollDurationInMin: {
            type: Number,
            required: [true, "PollDurationInMinutes is required"],
        },
        pollStartTime: { type: Date, default: null },
        pollEndTime: { type: Date, default: null },
        isAnonymousAllowed: { type: Boolean, required: true, default: false },
        shareCode: {
            type: String,
            required: true,
            unique: true,
            default: () => new mongoose.Types.ObjectId().toString(),
        },
        analyticsCode: {
            type: String,
            required: true,
            unique: true,
            default: () => new mongoose.Types.ObjectId().toString(),
        },
        isResultPublished: {
            type: Boolean,
            required: true,
            default: false,
        },
        status: {
            type: String,
            enum: ["draft", "active", "ended"],
            default: "draft",
            required: true,
        },
        totalVotes: {
            type: Number,
            required: true,
            default: 0,
        },
        totalParticipants: {
            type: Number,
            required: true,
            default: 0,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
            index: true,
        },
    },
    { timestamps: true },
);

const questionSchema: Schema = new Schema<IQuestion>(
    {
        question: {
            type: String,
            required: [true, "Question is requried"],
        },
        pollId: {
            type: Schema.Types.ObjectId,
            ref: "Poll",
            index: true,
            required: true,
        },
        options: {
            type: [
                {
                    text: {
                        type: String,
                        required: true,
                    },
                    order: {
                        type: Number,
                        required: true,
                    },
                    votes: {
                        types: Number,
                        default: 0,
                    },
                },
            ],
            validate: {
                validator: function (val: IOption[]) {
                    return val.length >= 2 && val.length <= 4;
                },
                message: "Options must contain between 2 and 4 items",
            },
        },
        isRequired: {
            type: Boolean,
            required: true,
            default: true,
        },
        questionNumber: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

const Poll = mongoose.model<IPoll>("Poll", pollSchema);
const Question = mongoose.model<IQuestion>("Question", questionSchema);

export { Poll, Question };
