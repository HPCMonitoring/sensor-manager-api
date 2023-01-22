import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import { config } from "./config";
import * as rest from "@controllers";
import { AjvErrorObject } from "@tsed/ajv";
import { BAD_REQUEST, INVALID_PATH_PARAMS, MISSING_FIELDS } from "@constants";

@Configuration({
    ...config,
    acceptMimes: ["application/json"],
    httpPort: process.env.PORT || 8080,
    httpsPort: false, // CHANGE
    componentsScan: false,
    mount: {
        "/api": [...Object.values(rest)]
    },
    swagger: [
        {
            path: "/docs",
            specVersion: "3.0.1"
        }
    ],
    middlewares: [
        cors(),
        cookieParser(),
        compress({}),
        methodOverride(),
        bodyParser.json(),
        bodyParser.urlencoded({
            extended: true
        })
    ],
    exclude: ["**/*.spec.ts"],
    ajv: {
        errorFormatter: (err: AjvErrorObject) => {
            if (err.keyword === "required") {
                return MISSING_FIELDS;
            }
            // Error occurs on PathParams
            if (err.instancePath.length === 0) {
                return INVALID_PATH_PARAMS;
            }

            const instanceAccesses = err.instancePath.split("/");
            let rawErrorField: string;

            // Occurs if error on an item of an array
            if (!isNaN(parseInt(instanceAccesses[instanceAccesses.length - 1]))) {
                // If not have field name of input
                if (instanceAccesses[instanceAccesses.length - 2].length === 0) rawErrorField = "item";
                else {
                    rawErrorField = `AnItemOf${
                        instanceAccesses[instanceAccesses.length - 2][0].toUpperCase() +
                        instanceAccesses[instanceAccesses.length - 2].slice(1)
                    }`;
                }
            } else rawErrorField = instanceAccesses[instanceAccesses.length - 1];

            const errorField = rawErrorField
                // For snake case
                .replaceAll("_", " ")
                // For camel case
                .replace(/([A-Z])/g, " $1")
                .trim()
                .split(" ")
                .map((word) => word[0].toLowerCase() + word.slice(1))
                .join(" ");

            const capitalizedErrorField = errorField[0].toUpperCase() + errorField.slice(1);

            if (err.keyword === "maxLength" || err.keyword === "minLength") {
                return `${capitalizedErrorField} is invalid !`;
            }
            if (err.keyword === "enum") {
                return `${capitalizedErrorField} must be one of allowed values: ${err.params.allowedValues
                    .map((value: string) => `"${value}"`)
                    .join(", ")} !`;
            }
            if (err.keyword === "minItems" || err.keyword === "maxItems") {
                return `${capitalizedErrorField} ${err.message} !`;
            }
            if (err.keyword === "minimum") {
                return `${capitalizedErrorField} must be greater than or equal ${err.params.limit} !`;
            }
            if (err.keyword === "maximum") {
                return `${capitalizedErrorField} must be less than or equal ${err.params.limit} !`;
            }
            if (err.keyword === "type") {
                return `${capitalizedErrorField} ${err.message} !`;
            }
            if (err.keyword === "uniqueItems") {
                return `Items of ${errorField} must be unique !`;
            }
            // Default
            return BAD_REQUEST;
        }
    }
})
export class Server {
    @Inject()
    protected app: PlatformApplication;

    @Configuration()
    protected settings: Configuration;
}
