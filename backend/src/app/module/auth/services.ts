import ApiError from "../../common/utils/ApiError.js";
import {
    comparePasswordHash,
    generateAccessAndRefreshToken,
    generatePasswordHash,
} from "../../common/utils/token.js";
import User, { type IUser } from "./model.js";

export const toAuthUser = (
    user: Pick<IUser, "_id" | "fullName" | "email" | "createdAt" | "updatedAt">,
) => ({
    _id: String(user._id),
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const signupService = async (
    fullName: string,
    email: string,
    password: string,
) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    //hash the user password
    const hashedPassword = await generatePasswordHash(password);

    //create new user
    const newUser = new User({
        fullName,
        email,
        password,
    });

    //TODO : send mail
    // lcoal signup should not fail because email is unavailable

    await newUser.save();

    // return user data without password to frontend;
    return toAuthUser(newUser);
};

export const signinService = async (email: string, password: string) => {
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    //TODO: check is user isVerified or not

    //check this once again
    const isPasswordValid = await comparePasswordHash(user.password, password);
    if (!isPasswordValid) {
        throw new ApiError(400, "invalid email or password");
    }

    //generate access and Refresh Tokens
    const { accessToken, refreshToken } = generateAccessAndRefreshToken({
        userId: user._id,
    });

    user.refreshToken = await generatePasswordHash(refreshToken);
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: toAuthUser(user),
    };
};
