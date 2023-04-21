import { cpuScript, diskScript, ioScript, memoryScript, networkInterfaceScript, processScript } from "@dtos/in";
import { buildAST, staticCheckConfig } from "@utils";

describe("Test yaml validation of all datatype which is not process", () => {
  test("Network interface", () => {
    const yamlScript = `
        type: network_interface
        fields:
          name: iname
          receive: in
          transmit: out
        `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, networkInterfaceScript)).toStrictEqual(true);
  });
  test("Memory", () => {
    const yamlScript = `
        type: memory
        fields:
          available: ableToUsed
          free:
        `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, memoryScript)).toStrictEqual(true);
  });
  test("IO", () => {
    const yamlScript = `
        type: io
        fields:
          readPerSec: rps
          writePerSec: wps
          device: dname
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
          virtualMemory:
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
        virtualMemory:
      filters:
        - virtualMemory:
            lte: 15
            gte: 50
      `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(true);
  });
  test("Single not eq condition with additional properties", () => {
    const yamlScript = `
      type: process
      fields:
        pid:
        gid:
        virtualMemory:
      filters:
        - virtualMemory:
            lte: 15
            gte: 50
            additionalProp: 145
      `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(false);
  });
  test("Combine relational conditions", () => {
    const yamlScript = `
    type: process
    fields:
      pid:
      gid:
      virtualMemory:
    filters:
      - gid: 5
      - name:
          like: "%helloworld%"
      - virtualMemory:
          lte: 15
          gte: 50
    `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(true);
  });
  
  test("Filter with an item has RHS null", () => {
    const yamlScript = `
    type: process
    fields:
      pid: processID
    filters:
      - OR:
        - pid: 1
        - command:
    `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(false);
  });
  test("Filter with an item has more than 1 field", () => {
    const yamlScript = `
    type: process
    fields:
      pid: processID
    filters:
      - pid: 1
        command:
    `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(false);
  });
  test("Filter with an item not in schema", () => {
    const yamlScript = `
    type: process
    fields:
      pid: processID
    filters:
      - Hello: 1
    `;
    const ast = buildAST(yamlScript)
    expect(staticCheckConfig(ast, processScript)).toStrictEqual(false);
  });

  test("AND condition", () => {
    const yamlScript = `
    type: process
    fields:
      pid:
      gid:
      virtualMemory:
    filters:
      - AND:
        - gid: 5
        - name:
            like: "%helloworld%"
        - virtualMemory:
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
      virtualMemory:
    filters:
      - OR:
        - gid: 5
        - name:
            like: "%helloworld%"
        - virtualMemory:
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
      - virtualMemory:
          lte: 15
          gte: 50
      - AND:
        - gid: 5
        - name:
            like: "%helloworld%"
        - virtualMemory:
            lte: 15
            gte: 50
      - OR:
        - gid: 5
        - name:
            like: "%helloworld%"
        - virtualMemory:
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
          virtualMemory: {
            lte: 15,
            gte: 50
          }
        },
        {
          AND: [
            { gid: 5 },
            { name: { like: "%helloworld%" } },
            {
              virtualMemory: {
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
              virtualMemory: {
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
          - virtualMemory:
              lte: 15
              gte: 50
          - OR: 
            - name:
                like: "%helloworld%"
            - virtualMemory:
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
