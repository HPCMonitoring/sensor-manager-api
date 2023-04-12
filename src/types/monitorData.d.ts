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

type NotEqOp = "lt" | "lte" | "gt" | "gte";

type PartialRecord<K extends string, V> = Partial<Record<K, V>>;

type EqCondition = PartialRecord<ProcessEqField, number>;
type NotEqCondition = PartialRecord<ProcessNotEqField, PartialRecord<NotEqOp, number>>;
type RegexCondition = PartialRecord<ProcessRegexField, { like: string }>;
type AndCondition = { AND?: Condition[] };
type OrCondition = { OR?: Condition[] };

type Condition = EqCondition & RegexCondition & NotEqCondition & AndCondition & OrCondition;

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
