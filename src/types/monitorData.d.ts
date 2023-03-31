type ProcessEqField = "pid" | "parentPid" | "uid" | "gid";
type ProcessRegexField = "name" | "executePath" | "command";
type ProcessNotEqField =
    | "virtualMemoryUsage"
    | "physicalMemoryUsage"
    | "cpuTime"
    | "cpuUsage"
    | "networkInBandwidth"
    | "networkOutBandwidth"
    | "ioWrite"
    | "ioRead";
type ProcessField = ProcessEqField | ProcessRegexField | ProcessNotEqField;

type NetworkInterfaceField = "name" | "inBandwidth" | "outBandwidth";
type MemoryField = "used" | "available" | "swapUsed" | "swapFree";
type CpuField = "user" | "nice" | "system" | "iowait" | "steal" | "idle";
type IOField = "deviceName" | "readPerSecond" | "writePerSecond";
type DiskField = "filesystem" | "used" | "available" | "mountedOn";

type NotEqExpr = "lt" | "lte" | "gt" | "gte";

type PartialRecord<K extends string, V> = Partial<Record<K, V>>;
type EqCondition = PartialRecord<ProcessEqField, number>;
type NotEqCondition = PartialRecord<ProcessNotEqField, PartialRecord<NotEqExpr, number>>;
type RegexCondition = PartialRecord<ProcessRegexField, { like: string }>;
type AndCondition = { AND?: Condition[] };
type OrCondition = { OR?: Condition[] };

type Condition = EqCondition & RegexCondition & NotEqCondition & AndCondition & OrCondition;

type Enumerable<T> = T | T[];
type ProcessScript = {
    type: "process";
    fields: PartialRecord<ProcessField, string | null>;
    filters?: AndCondition | OrCondition;
};

type NetworkInterfaceScript = {
    type: "network_interface";
    fields: PartialRecord<NetworkInterfaceField, string | null>;
};

type MemScript = {
    type: "memory";
    fields: PartialRecord<MemoryField, string | null>;
};

type CpuScript = {
    type: "cpu";
    fields: PartialRecord<CpuField, string | null>;
};

type IOScript = {
    type: "io";
    fields: PartialRecord<IOField, string | null>;
};

type DiskScript = {
    type: "disk";
    fields: PartialRecord<DiskField, string | null>;
};

type ConfigScriptAST = ProcessScript | NetworkInterfaceScript | MemScript | CpuScript | IOScript | DiskScript;
