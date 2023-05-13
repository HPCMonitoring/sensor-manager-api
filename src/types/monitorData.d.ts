type ProcessEqField = "pid" | "parentPid" | "uid" | "gid";
type ProcessRegexField = "name" | "executePath" | "command";
type ProcessNotEqField = "virtualMemory" | "physicalMemory" | "cpuTime" | "cpuUsage" | "networkIn" | "networkOut" | "writeKBs" | "readKBs";
type ProcessField = ProcessEqField | ProcessRegexField | ProcessNotEqField;

type NetworkInterfaceField = "name" | "receive" | "transmit";
type MemoryField = "total" | "free" | "available" | "buffers" | "cached" | "swapTotal" | "swapFree" | "swapCached";
type CpuField = "order" | "user" | "nice" | "system" | "idle" | "iowait" | "irq" | "softirq" | "steal" | "guest" | "guestNice";
type IOField = "device" | "tps" | "readPerSec" | "read" | "writePerSec" | "write" | "discardPerSec" | "discard";
type DiskField = "filesystem" | "size" | "used" | "available" | "usedPercentage" | "mountedOn";

type NotEqOp = "lt" | "lte" | "gt" | "gte";

/**
 * In runtime, each record has only one field.
 */
type PartialRecord<K extends string, V> = Partial<Record<K, V>>;

/**
 * In runtime, each record has only one field.
 */
type EqCondition = PartialRecord<ProcessEqField, number>;
/**
 * In runtime, each record has only one field.
 */
type NotEqCondition = PartialRecord<ProcessNotEqField, PartialRecord<NotEqOp, number>>;
/**
 * In runtime, each record has only one field.
 */
type RegexCondition = PartialRecord<ProcessRegexField, { like: string }>;

type AndCondition = { AND?: Condition[] };
type OrCondition = { OR?: Condition[] };

/**
 * In runtime, each record has only one field.
 */
type Condition = EqCondition | RegexCondition | NotEqCondition | AndCondition | OrCondition;

type ProcessScriptAST = {
    type: "process";
    fields: PartialRecord<ProcessField, string | null>;
    filters?: Condition[];
};

type NetworkInterfaceScriptAST = {
    type: "network_interface";
    fields: PartialRecord<NetworkInterfaceField, string | null>;
};

type MemScriptAST = {
    type: "memory";
    fields: PartialRecord<MemoryField, string | null>;
};

type CpuScriptAST = {
    type: "cpu";
    fields: PartialRecord<CpuField, string | null>;
};

type IOScriptAST = {
    type: "io";
    fields: PartialRecord<IOField, string | null>;
};

type DiskScriptAST = {
    type: "disk";
    fields: PartialRecord<DiskField, string | null>;
};

type ConfigScriptAST = ProcessScriptAST | NetworkInterfaceScriptAST | MemScriptAST | CpuScriptAST | IOScriptAST | DiskScriptAST;
