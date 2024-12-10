import app from "./src/app";
import { handle } from "hono/aws-lambda";

export const handler = handle(app);
