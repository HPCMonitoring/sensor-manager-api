import { Environment } from "@types";
import * as dotenv from "dotenv";
dotenv.config();

export const ENVIRONMENT = !process.env.NODE_ENV ? "development" : (process.env.NODE_ENV as Environment);
