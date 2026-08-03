import type { Request, Response } from "express";
import ApiError from "../../common/utils/ApiError.js";
import ApiResponse from "../../common/utils/ApiResponse.js";
import {
    createPollSchema,
    createQuestionSchema,
    updatePollSchema,
} from "./validator.js";
import {
    createPollService,
    createQuestionService,
    deletePollService,
    updatePollService,
} from "./services.js";

export const createPoll = async (req: Request, res: Response) => {
    const result = createPollSchema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));
        return res
            .status(400)
            .json(ApiResponse.error("Validation failed", errors));
    }

    try {
        const poll = await createPollService({
            ...result.data,
            userId: req.user!._id,
        });
        return res
            .status(201)
            .json(ApiResponse.success("Poll created successfully", poll));
    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(ApiResponse.error(error.message));
        }
        console.error("Create poll error:", error);
        return res.status(500).json(ApiResponse.error("Internal server error"));
    }
};

export const updatePoll = async (req: Request, res: Response) => {
    const { pollId } = req.params;
    if (!pollId || Array.isArray(pollId)) {
        return res.status(400).json(ApiResponse.error("Poll Id is required"));
    }

    const result = updatePollSchema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));
        return res
            .status(400)
            .json(ApiResponse.error("Validation failed", errors));
    }

    try {
        const poll = await updatePollService({
            pollId,
            userId: req.user!._id,
            ...result.data,
        });

        //TODO: public shared code

        return res
            .status(200)
            .json(ApiResponse.success("Poll updated successful", poll));
    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(ApiResponse.error(error.message));
        }
        console.error("Update poll error:", error);
        return res.status(500).json(ApiResponse.error("Internal server error"));
    }
};

export const deletePoll = async (req: Request, res: Response) => {
    const { pollId } = req.params;

    if (!pollId || Array.isArray(pollId)) {
        return res.status(400).json(ApiResponse.error("Poll id is required"));
    }

    try {
        const poll = await deletePollService({
            pollId,
            userId: req.user!._id,
        });

        return res
            .status(200)
            .json(ApiResponse.success("POLL Deleted successful", poll));
    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(ApiResponse.error(error.message));
        }
        console.error("Delete poll error:", error);
        return res.status(500).json(ApiResponse.error("Internal server error"));
    }
};

export const createQuestion = async (req: Request, res: Response) => {
    const { pollId } = req.params;
    if (!pollId || Array.isArray(pollId)) {
        return res.status(400).json(ApiResponse.error("Poll ID is required"));
    }
    const result = createQuestionSchema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));
        return res
            .status(400)
            .json(ApiResponse.error("Validation failed", errors));
    }

    try {
        const question = createQuestionService({
            pollId,
            userId: req.user!._id,
            ...result.data,
        });
        return res
            .status(201)
            .json(
                ApiResponse.success("Question created successfully", question),
            );
    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(ApiResponse.error(error.message));
        }
        console.error("Create question error:", error);
        return res.status(500).json(ApiResponse.error("Internal server error"));
    }
};

//todo : updatequestion, updatequestionorder, deletequestion, updateoptions
