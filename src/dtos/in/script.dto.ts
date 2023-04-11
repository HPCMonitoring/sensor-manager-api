import { nullable } from "@dtos/common";
import s from "fluent-json-schema";

const aliasName = s.string().raw(nullable);
const likeExpr = s.object().additionalProperties(false).prop("like", s.string().required());
const notEqExpr = s
    .object()
    .additionalProperties(false)
    .minProperties(1)
    .maxProperties(4)
    .patternProperties({ "^(lt|lte|gt|gte)$": s.number() });

export const equalCondition = s
    .object()
    .id("#equalCondition")
    .minProperties(1)
    .additionalProperties(false)
    .prop("pid", s.number())
    .prop("parentPid", s.number())
    .prop("uid", s.number())
    .prop("gid", s.number());

export const notEqualCondition = s
    .object()
    .id("#notEqualCondition")
    .minProperties(1)
    .additionalProperties(false)
    .prop("virtualMemoryUsage", notEqExpr)
    .prop("physicalMemoryUsage", notEqExpr)
    .prop("cpuTime", notEqExpr)
    .prop("cpuUsage", notEqExpr)
    .prop("networkInBandwidth", notEqExpr)
    .prop("networkOutBandwidth", notEqExpr)
    .prop("ioRead", notEqExpr)
    .prop("ioWrite", notEqExpr);

export const likeCondition = s
    .object()
    .id("#likeCondition")
    .minProperties(1)
    .additionalProperties(false)
    .prop("name", likeExpr)
    .prop("executePath", likeExpr)
    .prop("command", likeExpr);

export const fieldCondition = s
    .object()
    .minProperties(1)
    .id("#fieldCondition")
    .anyOf([s.ref("#equalCondition"), s.ref("#notEqualCondition"), s.ref("#likeCondition")]);

export const processScript = s
    .object()
    .definition("equalCondition", equalCondition)
    .definition("notEqualCondition", notEqualCondition)
    .definition("likeCondition", likeCondition)
    .definition("fieldCondition", fieldCondition)
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
    .prop(
        "filters",
        s
            .array()
            .minItems(1)
            .items(
                s.anyOf([
                    s.ref("#fieldCondition"),
                    s.object().prop("AND", s.ref("#fieldCondition")),
                    s.object().prop("OR", s.ref("#fieldCondition"))
                ])
            )
    );

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
export const scriptSchema = s.anyOf([processScript, networkInterfaceScript, memoryScript, cpuScript, ioScript, diskScript]);
