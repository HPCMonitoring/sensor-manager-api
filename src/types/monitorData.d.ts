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

type Condition = PartialRecord<ProcessEqField, number> &
    PartialRecord<ProcessRegexField, { like: string }> &
    PartialRecord<ProcessNotEqField, PartialRecord<NotEqExpr, number>> & {
        AND?: Enumerable<Condition>;
        OR?: Enumerable<Condition>;
    };

type Enumerable<T> = T | T[];
type ConfigScriptAST =
    | {
          type: "process";
          fields: PartialRecord<ProcessField, string | null>;
          filters?: Condition;
      }
    | {
          type: "network_interface";
          fields: PartialRecord<NetworkInterfaceField, string | null>;
      }
    | {
          type: "memory";
          fields: PartialRecord<MemoryField, string | null>;
      }
    | {
          type: "cpu";
          fields: PartialRecord<CpuField, string | null>;
      }
    | {
          type: "io";
          fields: PartialRecord<IOField, string | null>;
      }
    | {
          type: "disk";
          fields: PartialRecord<DiskField, string | null>;
      };
