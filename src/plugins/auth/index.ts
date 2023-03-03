import { SwaggerControllerTag } from "@constants";
import { authCtrler } from "@controllers";
import { authInputSchema } from "@schemas/in";
import { authResultSchema } from "@schemas/out";
import { createPlugin } from "@utils";

export const authPlugin = createPlugin(
    [SwaggerControllerTag.AUTH],
    [
        {
            method: "POST",
            url: "/login",
            schema: {
                body: authInputSchema,
                response: {
                    200: authResultSchema
                }
            },
            handler: authCtrler.login
        },
        {
            method: "POST",
            url: "/signup",
            schema: {
                body: authInputSchema,
                response: {
                    200: authResultSchema
                }
            },
            handler: authCtrler.signup
        }
    ]
);
