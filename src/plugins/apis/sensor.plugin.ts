import { SwaggerControllerTag } from "@constants";
import { sensorCtrler } from "@controllers";
import { idSchema } from "@schemas/common";
import { getAllSensorsSchema } from "@schemas/out";
import { createPlugin } from "@utils";
import s from "fluent-json-schema";

export const sensorPlugin = createPlugin(
    [SwaggerControllerTag.SENSOR],
    [
        {
            method: "GET",
            url: "",
            schema: {
                querystring: s.object().prop("clusterId", idSchema),
                response: {
                    200: getAllSensorsSchema
                }
            },
            handler: sensorCtrler.getByClusterId
        }
    ]
);
