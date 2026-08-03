import type mongoose from "mongoose";
import type { ICreatePoll, ICreateQuestion, IUpdatePoll } from "./validator.js";
import { Poll, Question } from "./model.js";
import ApiError from "../../common/utils/ApiError.js";
import { sanitizeRichText } from "../../common/utils/sanitizeHtml.js";

type CreatePollServiceInput = ICreatePoll & {
    userId: mongoose.Types.ObjectId;
};

type UpdatePollServiceInput = IUpdatePoll & {
    pollId: string;
    userId: mongoose.Types.ObjectId;
};

type CreateQuestionServiceInput = ICreateQuestion & {
    pollId: string;
    userId: mongoose.Types.ObjectId;
};

type DeletePollServiceInput = {
    pollId: string;
    userId: mongoose.Types.ObjectId;
};

export const createPollService = async ({
    pollName,
    pollDescription,
    pollDurationInMin,
    isAnonymousAllowed,
    status,
    userId,
}: CreatePollServiceInput) => {
    const startTime = status === "active" ? new Date() : null;
    const poll = new Poll({
        pollName,
        pollDescription,
        pollDurationInMin,
        pollStartTime: startTime,
        pollEndTime: startTime
            ? new Date(startTime.getTime() + pollDurationInMin * 60 * 1000)
            : null,
        isAnonymousAllowed,
        status: status ?? "draft",
        createdBy: userId,
    });

    const savedPoll = await poll.save();
    return savedPoll;
};

export const updatePollService = async ({
    pollId,
    userId,
    pollName,
    pollDescription,
    pollDurationInMin,
    isAnonymousAllowed,
    isResultPublished,
    status,
}: UpdatePollServiceInput) => {
    const poll = await Poll.findOne({ _id: pollId, createdBy: userId });

    if (!poll) {
        throw new ApiError(404, "Poll not found");
    }

    if (pollName !== undefined) {
        poll.pollName = pollName;
    }

    if (pollDescription !== undefined) {
        poll.pollDescription = sanitizeRichText(pollDescription);
    }

    if (pollDurationInMin !== undefined) {
        poll.pollDurationInMin = pollDurationInMin;

        if (poll.pollStartTime) {
            poll.pollEndTime = new Date(
                poll.pollStartTime.getTime() + pollDurationInMin * 60 * 1000,
            );
        }
    }

    if (isResultPublished !== undefined) {
        if (
            isResultPublished &&
            poll.status === "active" &&
            poll.pollEndTime &&
            poll.pollEndTime.getTime() <= Date.now()
        ) {
            poll.status = "ended";
        }

        if (isResultPublished && poll.status !== "ended") {
            throw new ApiError(
                400,
                "Poll results can only be published after the poll has ended",
            );
        }

        poll.isResultPublished = isResultPublished;
    }

    if (status !== undefined) {
        if (status === "active" && poll.status !== "active") {
            const startTime = new Date();
            poll.pollStartTime = startTime;
            poll.pollEndTime = new Date(
                startTime.getTime() + poll.pollDurationInMin * 60 * 1000,
            );
        }

        poll.status = status;
    }

    const updatedPoll = await poll.save();
    return updatedPoll;
};

export const deletePollService = async ({
    pollId,
    userId,
}: DeletePollServiceInput) => {
    const poll = await Poll.findOne({ _id: pollId, createdBy: userId });

    if (!poll) {
        throw new ApiError(404, "Poll not found");
    }

    //TODO: delte form vote and question

    await poll.deleteOne();

    return poll;
};

export const createQuestionService = async ({
    question,
    pollId,
    userId,
    questionNumber,
    isRequired,
    options,
}: CreateQuestionServiceInput) => {
    const poll = await Poll.findOne({ _id: pollId, createdBy: userId });

    if (!poll) {
        throw new ApiError(404, "POll not found");
    }

    const questionObj = new Question({
        question: sanitizeRichText(question),
        pollId,
        questionNumber,
        isRequired,
        options: options.map((option) => ({
            ...option,
            text: sanitizeRichText(option.text),
        })),
    });

    const savedQuestion = await questionObj.save();
    return savedQuestion;
};
