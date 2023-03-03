import { SwaggerControllerTag } from "@constants";
import { clusterCtrler } from "@controllers";
import { getAllClustersSchema } from "@schemas/out";
import { createPlugin } from "@utils";

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
            handler: clusterCtrler.getClusters
        }
    ]
);
