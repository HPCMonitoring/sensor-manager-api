import { HandlerTag } from "@constants";
import { usersHandler } from "@handlers";
import { filterTemplateSchema } from "@dtos/out";
import { createPlugin } from "@utils";
import s from "fluent-json-schema";

export const userPlugin = createPlugin(
    [HandlerTag.USER],
    [
        // {
        //     method: 'GET',
        //     url: '',
        //     schema: {
        //         response: {
        //             200: getUserSchema
        //         }
        //     },
        //     handler: usersHandler.getUserById
        // },
        {
            method: "GET",
            url: "/filter-templates",
            schema: {
                response: {
                    200: s.array().items(filterTemplateSchema)
                }
            },
            handler: usersHandler.getFilterTemplates
        }
    ]
);
