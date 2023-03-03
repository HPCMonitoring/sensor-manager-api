import { SwaggerControllerTag } from "@constants";
import { usersCrtler } from "@controllers";
import { getUserSchema } from "@schemas/out";
import { createPlugin } from "@utils";

export const userPlugin = createPlugin(
    [SwaggerControllerTag.USER],
    [
        {
            method: "GET",
            url: "",
            schema: {
                response: {
                    200: getUserSchema
                }
            },
            handler: usersCrtler.getUserById
        }
    ]
);
