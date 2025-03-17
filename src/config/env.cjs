const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const ENV = {
    PORT: process.env.PORT ?? 3000,
    DATABASE: {
        DB_USER: process.env.DB_USER ?? "",
        DB_PASSWORD: process.env.DB_PASSWORD ?? "",
        DB_HOST: process.env.DB_HOST ?? "",
        DB_DATABASE: process.env.DB_DATABASE ?? "",
        DB_PORT: parseInt(process.env.DB_PORT ?? "5432"),
        URL: process.env.URL ?? "",
    },
    API: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
        DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ?? "",
    },
    GOOGLE_CLOUD: {
        PROJECT_ID: process.env.PROJECT_ID ?? "",
        BUCKET_NAME: process.env.BUCKET_NAME ?? "",
        KEYFILENAME: process.env.KEYFILENAME ?? "",
    },
    BACKEND_URL: process.env.BACKEND_URL ?? "",
    NODE_ENV: process.env.NODE_ENV ?? "development",
    SSL: {
        REJECT_UNAUTHORIZED: process.env.SSL_REJECT_UNAUTHORIZED === "true"
    }
};


console.log("Loaded ENV.DATABASE:", ENV.DATABASE);

module.exports = { ENV };