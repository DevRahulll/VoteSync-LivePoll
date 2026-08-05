import type { Request, Response } from "express";
import ApiError from "../../common/utils/ApiError.js";
import ApiResponse from "../../common/utils/ApiResponse.js";
import {
    createPollSchema,
    createQuestionSchema,
    updatePollSchema,
    updateQuestionSchema,
} from "./validator.js";
import {
    createPollService,
    createQuestionService,
    deletePollService,
    deleteQuestionService,
    updatePollService,
    updateQuestionService,
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

//Todo
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

export const updateQuestion = async (req: Request, res: Response) => {
    const { pollId, questionId } = req.params;
    if (!pollId || Array.isArray(pollId)) {
        return res.status(400).json(ApiResponse.error("Poll id is required"));
    }
    if (!questionId || Array.isArray(questionId)) {
        return res
            .status(400)
            .json(ApiResponse.error("Question id is required"));
    }

    const result = updateQuestionSchema.safeParse(req.body);
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
        const question = await updateQuestionService({
            pollId,
            questionId,
            userId: req.user!._id,
            ...result.data,
        });
        return res
            .status(200)
            .json(
                ApiResponse.success("Question updated successfully", question),
            );
    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(ApiResponse.error(error.message));
        }
        console.error("Update question error:", error);
        return res.status(500).json(ApiResponse.error("Internal server error"));
    }
};

export const deleteQuestion = async (req: Request, res: Response) => {
    const { pollId, questionId } = req.params;
    if (!pollId || Array.isArray(pollId)) {
        return res.status(400).json(ApiResponse.error("Poll id is required"));
    }

    if (!questionId || Array.isArray(questionId)) {
        return res
            .status(400)
            .json(ApiResponse.error("Question id is required"));
    }

    try {
        const question = await deleteQuestionService({
            pollId,
            questionId,
            userId: req.user!._id,
        });
        return res
            .status(200)
            .json(
                ApiResponse.success("Question deleted successfully", question),
            );
    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(ApiResponse.error(error.message));
        }
        console.error("Delete question error:", error);
        return res.status(500).json(ApiResponse.error("Internal server error"));
    }
};

export const updateQuestionOrder = async (req: Request, res: Response) => {};
export const updateOption = async (req: Request, res: Response) => {};
