import { SwaggerControllerTag } from "@constants";
import { clusterCtrler } from "@controllers";
import { idSchema } from "@schemas/common";
import { clusterInputSchema } from "@schemas/in";
import { clusterSchema, getAllClustersSchema } from "@schemas/out";
import { createPlugin } from "@utils";
import s from "fluent-json-schema";

export const clusterPlugin = createPlugin(
    [SwaggerControllerTag.CLUSTER],
    [
        {
            method: "GET",
            url: "",
            schema: {
                response: {
                    200: getAllClustersSchema
                }
            },
            handler: clusterCtrler.getAll
        },
        {
            method: "POST",
            url: "",
            schema: {
                body: clusterInputSchema,
                response: {
                    200: clusterSchema
                }
            },
            handler: clusterCtrler.create
        },
        {
            method: "PUT",
            url: "/:clusterId",
            schema: {
                params: s.object().prop("clusterId", idSchema),
                body: clusterInputSchema,
                response: {
                    200: clusterSchema
                }
            },
            handler: clusterCtrler.update
        },
        {
            method: "DELETE",
            url: "/:clusterId",
            schema: {
                params: s.object().prop("clusterId", idSchema),
                response: {
                    200: clusterSchema
                }
            },
            handler: clusterCtrler.delete
        }
    ]
);
