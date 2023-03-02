import { Environment } from "@types";
import * as dotenv from "dotenv";
dotenv.config();

export const ENVIRONMENT = !process.env.NODE_ENV ? "development" : (process.env.NODE_ENV as Environment);
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const COOKIES_SECRET = process.env.COOKIES_SECRET as string;
