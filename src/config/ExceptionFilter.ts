import { $log, PlatformContext, ResponseErrorObject } from "@tsed/common";
import { Catch, ExceptionFilterMethods } from "@tsed/platform-exceptions";
import { Exception } from "@tsed/exceptions";
import { TRY_LATER } from "@constants";

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
