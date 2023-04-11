import { cpuScript, diskScript, ioScript, memoryScript, networkInterfaceScript, processScript } from "@dtos/in";
import { buildAST, staticCheckConfig } from "@utils";

describe("Test yaml validation of all datatype which is not process", () => {
  test("Network interface", () => {
    const yamlScript = `
        type: network_interface
        fields:
          name: iname
          inBandwidth: in
          outBandwidth: out
        `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, networkInterfaceScript)).toStrictEqual(true);
  });
  test("Memory", () => {
    const yamlScript = `
        type: memory
        fields:
          available: iname
          used: in
        `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, memoryScript)).toStrictEqual(true);
  });
  test("IO", () => {
    const yamlScript = `
        type: io
        fields:
          readPerSecond: rps
          writePerSecond: wps
          deviceName: device
        `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, ioScript)).toStrictEqual(true);
  });
  test("CPU", () => {
    const yamlScript = `
        type: cpu
        fields:
          steal:
          idle:
        `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, cpuScript)).toStrictEqual(true);
  });
  test("Disk", () => {
    const yamlScript = `
        type: disk
        fields:
          filesystem: fs
          used:
          available:
        `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, diskScript)).toStrictEqual(true);
  });
});

describe("Test yaml validation of process", () => {
  test("No filters", () => {
    const yamlScript = `
        type: process
        fields:
          pid:
          gid:
          virtualMemoryUsage:
        `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(true);
  });
  test("No fields", () => {
    const yamlScript = `
      type: process
      fields:
      `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(false);
  });
  test("Single eq condition", () => {
    const yamlScript = `
      type: process
      fields:
        pid:
      filters:
        - pid: 1
      `;
    const ast = buildAST(yamlScript)
    const expectedAst = {
      type: "process",
      fields: {
        pid: null,
      },
      filters: [{
        pid: 1
      }]
    }

    expect(JSON.stringify(ast)).toBe(JSON.stringify(expectedAst))
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(true);
  });
  test("Single like condition", () => {
    const yamlScript = `
      type: process
      fields:
        pid:
      filters:
        - name:
            like: "%helloworld%"
      `;
    const ast = buildAST(yamlScript)
    const expectedAst = {
      type: "process",
      fields: {
        pid: null
      },
      filters: [{
        name: { like: "%helloworld%" }
      }]
    }

    expect(JSON.stringify(ast)).toBe(JSON.stringify(expectedAst))
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(true);
  });
  test("Single not eq condition", () => {
    const yamlScript = `
      type: process
      fields:
        pid:
        gid:
        virtualMemoryUsage:
      filters:
        - virtualMemoryUsage:
            lte: 15
            gte: 50
      `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(true);
  });
  test("Combine relational conditions", () => {
    const yamlScript = `
    type: process
    fields:
      pid:
      gid:
      virtualMemoryUsage:
    filters:
      - gid: 5
      - name:
          like: "%helloworld%"
      - virtualMemoryUsage:
          lte: 15
          gte: 50
    `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(true);
  });
  test("AND condition", () => {
    const yamlScript = `
    type: process
    fields:
      pid:
      gid:
      virtualMemoryUsage:
    filters:
      - AND:
        - gid: 5
        - name:
            like: "%helloworld%"
        - virtualMemoryUsage:
            lte: 15
            gte: 50
    `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(true);
  });
  test("OR condition", () => {
    const yamlScript = `
    type: process
    fields:
      pid:
      gid:
      virtualMemoryUsage:
    filters:
      - OR:
        - gid: 5
        - name:
            like: "%helloworld%"
        - virtualMemoryUsage:
            lte: 15
            gte: 50
    `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(true);
  });
  test("Combine conditions", () => {
    const yamlScript = `
    type: process
    fields:
      pid:
    filters:
      - gid: 5
      - name:
          like: "%helloworld%"
      - virtualMemoryUsage:
          lte: 15
          gte: 50
      - AND:
        - gid: 5
        - name:
            like: "%helloworld%"
        - virtualMemoryUsage:
            lte: 15
            gte: 50
      - OR:
        - gid: 5
        - name:
            like: "%helloworld%"
        - virtualMemoryUsage:
            lte: 15
            gte: 50
    `;
    const ast = buildAST(yamlScript)
    const expectedAst = {
      type: "process",
      fields: {
        pid: null
      },
      filters: [
        { gid: 5 },
        { name: { like: "%helloworld%" } },
        {
          virtualMemoryUsage: {
            lte: 15,
            gte: 50
          }
        },
        {
          AND: [
            { gid: 5 },
            { name: { like: "%helloworld%" } },
            {
              virtualMemoryUsage: {
                lte: 15,
                gte: 50
              }
            }
          ]
        },
        {
          OR: [
            { gid: 5 },
            { name: { like: "%helloworld%" } },
            {
              virtualMemoryUsage: {
                lte: 15,
                gte: 50
              }
            }
          ]
        }
      ]
    }

    expect(JSON.stringify(ast)).toBe(JSON.stringify(expectedAst))
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(true);
  });
  test("Nested conditions", () => {
    const yamlScript = `
    type: process
    fields:
      pid: processID
    filters:
      - OR:
        - AND:
          - pid: 1
          - command:
              like: "%matlab%"
        - gid: 5
        - OR: 
          - name:
              like: "%helloworld%"
          - virtualMemoryUsage:
              lte: 15
              gte: 50
          - OR: 
            - name:
                like: "%helloworld%"
            - virtualMemoryUsage:
                lte: 15
                gte: 50
      - cpuUsage:
          lte: 20
          gte: 50
    `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(true);
  });
});
