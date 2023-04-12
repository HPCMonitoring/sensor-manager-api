import { nullable } from "@dtos/common";
import s from "fluent-json-schema";

const createLikeExpr = (property: ProcessRegexField) =>
    s
        .object()
        .additionalProperties(false)
        .prop(property, s.object().required().additionalProperties(false).prop("like", s.string().required()));
const createNotEqExpr = (property: ProcessNotEqField) =>
    s
        .object()
        .additionalProperties(false)
        .prop(
            property,
            s
                .object()
                .required()
                .additionalProperties(false)
                .minProperties(1)
                .maxProperties(4)
                .prop("lt", s.number())
                .prop("lte", s.number())
                .prop("gt", s.number())
                .prop("gte", s.number())
        );
const createEqExpr = (property: ProcessEqField) => s.object().additionalProperties(false).prop(property, s.number().required());

const aliasName = s.string().raw(nullable);
const equalConditions = (["pid", "uid", "parentPid", "gid"] as ProcessEqField[]).map((prop) => createEqExpr(prop));
const notEqualConditions = (
    [
        "cpuTime",
        "cpuUsage",
        "ioRead",
        "ioWrite",
        "networkInBandwidth",
        "networkOutBandwidth",
        "physicalMemoryUsage",
        "virtualMemoryUsage"
    ] as ProcessNotEqField[]
).map((prop) => createNotEqExpr(prop));
const likeConditions = (["command", "executePath", "name"] as ProcessRegexField[]).map((prop) => createLikeExpr(prop));

export const fieldConditions = [...equalConditions, ...notEqualConditions, ...likeConditions];

export const processScript = s
    .object()
    .prop("type", s.const("process").required())
    .prop(
        "fields",
        s
            .object()
            .required()
            .additionalProperties(false)
            .minProperties(1)
            .maxProperties(15)
            .prop("pid", aliasName)
            .prop("parentPid", aliasName)
            .prop("uid", aliasName)
            .prop("gid", aliasName)
            .prop("name", aliasName)
            .prop("executePath", aliasName)
            .prop("command", aliasName)
            .prop("virtualMemoryUsage", aliasName)
            .prop("physicalMemoryUsage", aliasName)
            .prop("cpuTime", aliasName)
            .prop("cpuUsage", aliasName)
            .prop("networkInBandwidth", aliasName)
            .prop("networkOutBandwidth", aliasName)
            .prop("ioRead", aliasName)
            .prop("ioWrite", aliasName)
    )
    .definition(
        "filters",
        s
            .array()
            .id("#filters")
            .minItems(1)
            .items(
                s.oneOf([
                    ...fieldConditions,
                    s.object().additionalProperties(false).prop("AND", s.ref("#filters")),
                    s.object().additionalProperties(false).prop("OR", s.ref("#filters"))
                ])
            )
    )
    .prop("filters", s.ref("#filters"));

export const networkInterfaceScript = s
    .object()
    .additionalProperties(false)
    .prop("type", s.const("network_interface").required())
    .prop(
        "fields",
        s
            .object()
            .required()
            .minProperties(1)
            .maxProperties(3)
            .additionalProperties(false)
            .prop("name", aliasName)
            .prop("inBandwidth", aliasName)
            .prop("outBandwidth", aliasName)
    );

export const memoryScript = s
    .object()
    .additionalProperties(false)
    .prop("type", s.const("memory").required())
    .prop(
        "fields",
        s
            .object()
            .required()
            .minProperties(1)
            .maxProperties(4)
            .additionalProperties(false)
            .prop("used", aliasName)
            .prop("available", aliasName)
            .prop("swapUsed", aliasName)
            .prop("swapFree", aliasName)
    );
export const cpuScript = s
    .object()
    .additionalProperties(false)
    .prop("type", s.const("cpu").required())
    .prop(
        "fields",
        s
            .object()
            .required()
            .additionalProperties(false)
            .minProperties(1)
            .maxProperties(6)
            .prop("user", aliasName)
            .prop("nice", aliasName)
            .prop("system", aliasName)
            .prop("iowait", aliasName)
            .prop("steal", aliasName)
            .prop("idle", aliasName)
    );
export const ioScript = s
    .object()
    .additionalProperties(false)
    .prop("type", s.const("io").required())
    .prop(
        "fields",
        s
            .object()
            .required()
            .additionalProperties(false)
            .minProperties(1)
            .maxProperties(3)
            .prop("deviceName", aliasName)
            .prop("readPerSecond", aliasName)
            .prop("writePerSecond", aliasName)
    );
export const diskScript = s
    .object()
    .additionalProperties(false)
    .prop("type", s.const("disk").required())
    .prop(
        "fields",
        s
            .object()
            .required()
            .minProperties(1)
            .maxProperties(4)
            .additionalProperties(false)
            .prop("filesystem", aliasName)
            .prop("used", aliasName)
            .prop("available", aliasName)
            .prop("mountedOn", aliasName)
    );
export const scriptSchema = s.oneOf([processScript, networkInterfaceScript, memoryScript, cpuScript, ioScript, diskScript]);
