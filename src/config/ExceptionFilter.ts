import { $log, PlatformContext, ResponseErrorObject } from "@tsed/common";
import { Catch, ExceptionFilterMethods } from "@tsed/platform-exceptions";
import { Exception } from "@tsed/exceptions";
import { BAD_REQUEST, INVALID_PATH_PARAMS, MISSING_FIELDS, TRY_LATER } from "@constants";
import { AjvErrorObject } from "@tsed/ajv";

@Catch(Exception)
export class BadRequestExceptionFilter implements ExceptionFilterMethods {
    catch(exception: Exception, ctx: PlatformContext) {
        const { response } = ctx;
        const error = this.mapError(exception);
        const headers = this.getHeaders(exception);

        response.setHeaders(headers).status(error.status).body(error);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapError(error: any) {
        let message: string;
        if (error.status === 400) {
            const temp: string = error.message;
            message = temp.slice(temp.lastIndexOf("\n") + 1);
        } else if (error.status === 500) {
            message = TRY_LATER;
            $log.error(JSON.stringify(error, null, 2));
        } else message = error.message;
        return {
            name: error.origin?.name || error.name,
            message,
            status: error.status || 500,
            errors: this.getErrors(error)
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getErrors(error: any) {
        return [error, error.origin].filter(Boolean).reduce((errs, { errors }: ResponseErrorObject) => {
            return [...errs, ...(errors || [])];
        }, []);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getHeaders(error: any) {
        return [error, error.origin].filter(Boolean).reduce((obj, { headers }: ResponseErrorObject) => {
            return {
                ...obj,
                ...(headers || {})
            };
        }, {});
    }
}

export function errorFormatter(err: AjvErrorObject) {
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
                instanceAccesses[instanceAccesses.length - 2][0].toUpperCase() + instanceAccesses[instanceAccesses.length - 2].slice(1)
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
