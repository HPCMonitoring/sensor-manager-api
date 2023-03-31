import { scriptParser } from "@services/sensorConfigParser";

describe("testing validate script", () => {
    test("empty string should result in zero", () => {
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

        const prefixCommand = scriptParser.visitConfigScript(config);
        expect(prefixCommand).toBe("AND 1 AND 2 pid 10 uid 999");
    });
});
