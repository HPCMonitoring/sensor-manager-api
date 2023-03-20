import { HandlerTag } from "@constants";
import { clustersHandler } from "@handlers";
import { idSchema } from "@schemas/common";
import { clusterMutationSchema } from "@schemas/in";
import { clusterMutationResultSchema, clusterSummarySchema } from "@schemas/out";
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
                    200: clusterMutationResultSchema
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
                    200: clusterMutationResultSchema
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
                    200: clusterMutationResultSchema
                }
            },
            handler: clustersHandler.delete
        }
    ]
);
