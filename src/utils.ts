import { HandlerTag } from "@constants";
import { FastifyInstance, RouteOptions } from "fastify";
import { BaseSchema } from "fluent-json-schema";
import Ajv from "ajv";
import yaml from "js-yaml";

const ajv = new Ajv({
    allErrors: false,
    strict: false
});

export function createPlugin(swaggerTags: HandlerTag[], routesOptions: RouteOptions[]) {
    return async function (app: FastifyInstance) {
        routesOptions.forEach((options) => {
            app.route({
                ...options,
                schema: {
                    ...options.schema,
                    tags: swaggerTags
                }
            });
        });
    };
}

export function buildAST(yamlScript: string) {
    return yaml.load(yamlScript.replaceAll("\t", "  "));
}

export function staticCheckConfig(scriptAST: unknown, schema: BaseSchema<unknown>) {
    const validate = ajv.compile(schema.valueOf());
    return validate(scriptAST);
}
