import { scriptParser } from "@services/sensorConfigParser";

describe("sensor process script filter parser module", () => {
    test("test equal filter only", () => {
        const config: ConfigScriptAST = {
            type: "process",
            fields: {
                pid: "processId",
                name: "processName",
                virtualMemoryUsage: "RAM"
            },
            filters: {
                AND: [
                    {
                        pid: 10,
                        uid: 999
                    }
                ]
            }
        };

        const prefixCommand = scriptParser.toPrefixCommand(config.filters);
        expect(prefixCommand).toBe("&& 1 && 2 == pid 10 == uid 999");
    });

    test("test not equal filter only", () => {
        const config: ConfigScriptAST = {
            type: "process",
            fields: {
                pid: "processId",
                name: "processName",
                virtualMemoryUsage: "RAM"
            },
            filters: {
                AND: [
                    {
                        ioRead: {
                            lt: 90
                        },
                        ioWrite: {
                            lt: 90
                        }
                    }
                ]
            }
        };

        const prefixCommand = scriptParser.toPrefixCommand(config.filters);
        expect(prefixCommand).toBe("&& 1 && 2 < ioRead 90 < ioWrite 90");
    });

    test("test not equal filter only", () => {
        const config: ConfigScriptAST = {
            type: "process",
            fields: {
                pid: "processId",
                name: "processName",
                virtualMemoryUsage: "RAM"
            },
            filters: {
                AND: [
                    {
                        ioRead: {
                            lt: 90,
                            gt: 45
                        },
                        ioWrite: {
                            lt: 90
                        }
                    }
                ]
            }
        };

        const prefixCommand = scriptParser.toPrefixCommand(config.filters);
        expect(prefixCommand).toBe("&& 1 && 3 > ioRead 45 < ioRead 90 < ioWrite 90");
    });

    test("test regex filter only", () => {
        const config: ConfigScriptAST = {
            type: "process",
            fields: {
                pid: "processId",
                name: "processName",
                virtualMemoryUsage: "RAM"
            },
            filters: {
                AND: [
                    {
                        command: { like: "python*" },
                        executePath: { like: "/usr/bin/python3" }
                    }
                ]
            }
        };

        const prefixCommand = scriptParser.toPrefixCommand(config.filters);
        expect(prefixCommand).toBe(`&& 1 && 2 %= command "python*" %= executePath "/usr/bin/python3"`);
    });
});
