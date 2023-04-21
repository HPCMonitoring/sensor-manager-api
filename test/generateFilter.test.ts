import { filterGenerator } from "@services";

describe("sensor process script filter parser module", () => {
  test("Test equal filter only", () => {
    const filters: Condition[] = [{
      AND: [
        { pid: 10 },
        { uid: 999 }
      ]
    }];

    const prefixFilter = filterGenerator.toPrefix(filters);
    expect(prefixFilter).toBe("&& 2 == pid 10 == uid 999");
  });

  test("Test not equal filter only", () => {
    const filters: Condition[] = [
      { readKBs: { lt: 90 } },
      { writeKBs: { lt: 90 } }
    ];

    const prefixFilter = filterGenerator.toPrefix(filters);
    expect(prefixFilter).toBe("&& 2 < readKBs 90 < writeKBs 90");
  });

  test("Test not equal filter only", () => {
    const filters: Condition[] = [
      { readKBs: { lt: 45 } },
      {
        OR: [
          { writeKBs: { lt: 90 } },
          { parentPid: 15 }
        ]
      }
    ];

    const prefixFilter = filterGenerator.toPrefix(filters);
    expect(prefixFilter).toBe("&& 2 < readKBs 45 || 2 < writeKBs 90 == parentPid 15");
  });

  test("Test regex filter only", () => {
    const filters: Condition[] = [
      { command: { like: "python*" } },
      { executePath: { like: "/usr/bin/python3" } }
    ];

    const prefixFilter = filterGenerator.toPrefix(filters);
    expect(prefixFilter).toBe(`&& 2 %= command "python*" %= executePath "/usr/bin/python3"`);
  });

  test("Test regex filter only", () => {
    const filters: Condition[] = [
      { command: { like: "python*" } },
      { executePath: { like: "/usr/bin/python3" } }
    ];

    const prefixFilter = filterGenerator.toPrefix(filters);
    expect(prefixFilter).toBe(`&& 2 %= command "python*" %= executePath "/usr/bin/python3"`);
  });

  test("Test single condition", () => {
    const filters: Condition[] = [
      { executePath: { like: "/usr/bin/python3" } }
    ];
    const prefixFilter = filterGenerator.toPrefix(filters);
    expect(prefixFilter).toBe(`%= executePath "/usr/bin/python3"`);
  })

  test("Test multiple relational conditions", () => {
    const filters: Condition[] = [
      { executePath: { like: "/usr/bin/python3" } },
      { pid: 5 },
      { gid: 5 },
      { virtualMemory: { gt: 20 } }
    ];
    const prefixFilter = filterGenerator.toPrefix(filters);
    expect(prefixFilter).toBe(`&& 4 %= executePath "/usr/bin/python3" == pid 5 == gid 5 > virtualMemory 20`);
  })

  test("Test multiple conditions with AND & OR", () => {
    const filters: Condition[] = [
      {
        AND: [
          { executePath: { like: "/usr/bin/python3" } },
          { pid: 5 }
        ]
      },
      {
        OR: [
          { gid: 5 },
          { virtualMemory: { gt: 20 } }
        ]
      }
    ];
    const prefixFilter = filterGenerator.toPrefix(filters);
    expect(prefixFilter).toBe(`&& 2 && 2 %= executePath "/usr/bin/python3" == pid 5 || 2 == gid 5 > virtualMemory 20`);
  })

  test("Test a nested condition", () => {
    const filters: Condition[] = [
      {
        OR: [
          { gid: 5 },
          { virtualMemory: { gt: 20 } },
          {
            AND: [
              { executePath: { like: "%matlab%" } },
              { pid: 5 },
              { OR: [{ readKBs: { lt: 50 } }] }
            ]
          }
        ]
      }
    ];
    const prefixFilter = filterGenerator.toPrefix(filters);
    expect(prefixFilter).toBe(`|| 3 == gid 5 > virtualMemory 20 && 3 %= executePath "%matlab%" == pid 5 < readKBs 50`);
  })
});
