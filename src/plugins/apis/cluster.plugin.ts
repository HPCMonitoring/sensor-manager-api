import { HandlerTag } from "@constants";
import { clustersHandler } from "@handlers";
import { idSchema } from "@dtos/common";
import { clusterMutationSchema } from "@dtos/in";
import { clusterSummarySchema } from "@dtos/out";
import { createPlugin } from "@utils";
import s from "fluent-json-schema";

export const clusterPlugin = createPlugin(
    [HandlerTag.CLUSTER],
    [
        {
            method: "GET",
            url: "",
            schema: {
                response: {
                    200: s.array().items(clusterSummarySchema)
                }
            },
            handler: clustersHandler.getAll
        },
        {
            method: "POST",
            url: "",
            schema: {
                body: clusterMutationSchema,
                response: {
                    200: s.string()
                }
            },
            handler: clustersHandler.create
        },
        {
            method: "PUT",
            url: "/:clusterId",
            schema: {
                params: s.object().prop("clusterId", idSchema.required()),
                body: clusterMutationSchema,
                response: {
                    200: s.string()
                }
            },
            handler: clustersHandler.update
        },
        {
            method: "DELETE",
            url: "/:clusterId",
            schema: {
                params: s.object().prop("clusterId", idSchema.required()),
                response: {
                    200: s.string()
                }
            },
            handler: clustersHandler.delete
        }
    ]
);
