import { filterGenerator } from "@services";

describe("sensor process script filter parser module", () => {
  test("test equal filter only", () => {
    const config: ConfigScriptAST = {
      type: "process",
      fields: {
        pid: "processId",
        name: "processName",
        virtualMemoryUsage: "RAM"
      },
      filters: [{
        AND: [
          { pid: 10 },
          { uid: 999 }
        ]
      }]
    };

    const prefixFilter = filterGenerator.toPrefix(config.filters);
    expect(prefixFilter).toBe("&& 2 == pid 10 == uid 999");
  });

  test("test not equal filter only", () => {
    const config: ConfigScriptAST = {
      type: "process",
      fields: {
        pid: "processId",
        name: "processName",
        virtualMemoryUsage: "RAM"
      },
      filters: [
        { ioRead: { lt: 90 } },
        { ioWrite: { lt: 90 } }
      ]
    };

    const prefixFilter = filterGenerator.toPrefix(config.filters);
    expect(prefixFilter).toBe("&& 2 < ioRead 90 < ioWrite 90");
  });

  test("test not equal filter only", () => {
    const config: ConfigScriptAST = {
      type: "process",
      fields: {
        pid: "processId",
        name: "processName",
        virtualMemoryUsage: "RAM"
      },
      filters: [
        { ioRead: { lt: 45 } },
        {
          OR: [
            { ioWrite: { lt: 90 } },
            { parentPid: 15 }
          ]
        }
      ]
    };

    const prefixFilter = filterGenerator.toPrefix(config.filters);
    expect(prefixFilter).toBe("&& 2 < ioRead 45 || 2 < ioWrite 90 == parentPid 15");
  });

  test("test regex filter only", () => {
    const config: ConfigScriptAST = {
      type: "process",
      fields: {
        pid: "processId",
        name: "processName",
        virtualMemoryUsage: "RAM"
      },
      filters: [
        { command: { like: "python*" } },
        { executePath: { like: "/usr/bin/python3" } }
      ]
    };

    const prefixFilter = filterGenerator.toPrefix(config.filters);
    expect(prefixFilter).toBe(`&& 2 %= command "python*" %= executePath "/usr/bin/python3"`);
  });
});
