import { HandlerTag } from "@constants";
import { sensorHandler } from "@handlers";
import { idSchema } from "@schemas/common";
import { getAllSensorsSchema, getSensorSchema } from "@schemas/out";
import { createPlugin } from "@utils";
import s from "fluent-json-schema";

export const sensorPlugin = createPlugin(
    [HandlerTag.SENSOR],
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
            handler: sensorHandler.getByClusterId
        },
        {
            method: "GET",
            url: "/:sensorId",
            schema: {
                params: s.object().prop("sensorId", idSchema),
                response: {
                    200: getSensorSchema
                }
            },
            handler: sensorHandler.getById
        }
    ]
);
