import { HandlerTag } from "@constants";
import { sensorHandler } from "@handlers";
import { idSchema } from "@dtos/common";
import { updateSensorSchema } from "@dtos/in";
import { sensorSummarySchema, sensorDetailSchema } from "@dtos/out";
import { createPlugin } from "@utils";
import s from "fluent-json-schema";

export const sensorPlugin = createPlugin(
    [HandlerTag.SENSOR],
    [
        {
            method: "GET",
            url: "",
            schema: {
                querystring: s.object().prop("clusterId", idSchema.required()),
                response: {
                    200: s.array().items(sensorSummarySchema)
                }
            },
            handler: sensorHandler.getByClusterId
        },
        {
            method: "GET",
            url: "/:sensorId",
            schema: {
                params: s.object().prop("sensorId", idSchema.required()),
                response: {
                    200: sensorDetailSchema
                }
            },
            handler: sensorHandler.getById
        },
        {
            method: "PUT",
            url: "/:sensorId",
            schema: {
                params: s.object().prop("sensorId", idSchema.required()),
                body: updateSensorSchema,
                response: {
                    200: idSchema
                }
            },
            handler: sensorHandler.update
        },
        {
            method: "DELETE",
            url: "/:sensorId",
            schema: {
                params: s.object().prop("sensorId", idSchema.required()),
                response: {
                    200: idSchema
                }
            },
            handler: sensorHandler.delete
        }
    ]
);
