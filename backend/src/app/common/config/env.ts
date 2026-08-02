import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
    quiet: true,
});

const requiredEnvVariable = [
    "MONGODB_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_ACCESS_EXPIRY",
    "JWT_REFRESH_EXPIRY",
    "FRONTEND_URL",
];

const missingEnvironmentVariable = requiredEnvVariable.filter(
    (key) => !process.env[key],
);

if (missingEnvironmentVariable.length > 0) {
    console.error(
        `Missing some required environemnt variables: ${missingEnvironmentVariable.join(", ")}`,
    );
    process.exit(1);
}
