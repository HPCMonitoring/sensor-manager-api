import {
    cpuScript,
    diskScript,
    equalCondition,
    ioScript,
    likeCondition,
    memoryScript,
    networkInterfaceScript,
    notEqualCondition,
    processScript
} from "@dtos/in";
import Ajv, { ValidateFunction } from "ajv";
const ajv = new Ajv({ allErrors: false, strict: false });

class ScriptParser {
    private processValidator: ValidateFunction<unknown>;
    private neworkValidator: ValidateFunction<unknown>;
    private memValidator: ValidateFunction<unknown>;
    private cpuValidator: ValidateFunction<unknown>;
    private ioValidator: ValidateFunction<unknown>;
    private diskValidator: ValidateFunction<unknown>;
    private equalCondValidator: ValidateFunction<unknown>;
    private notEqCondValidator: ValidateFunction<unknown>;
    private likeCondValidator: ValidateFunction<unknown>;
    constructor() {
        this.processValidator = ajv.compile(processScript.valueOf());
        this.neworkValidator = ajv.compile(networkInterfaceScript.valueOf());
        this.memValidator = ajv.compile(memoryScript.valueOf());
        this.cpuValidator = ajv.compile(cpuScript.valueOf());
        this.ioValidator = ajv.compile(ioScript.valueOf());
        this.diskValidator = ajv.compile(diskScript.valueOf());
        this.equalCondValidator = ajv.compile(equalCondition.valueOf());
        this.notEqCondValidator = ajv.compile(notEqualCondition.valueOf());
        this.likeCondValidator = ajv.compile(likeCondition.valueOf());
    }
    visitConfigScript(script: ConfigScriptAST) {
        if (this.processValidator(script)) {
            return this.visitProcessScript(script as ProcessScript);
        } else if (this.memValidator(script)) {
            throw new Error("Not implemented");
        } else if (this.neworkValidator(script)) {
            throw new Error("Not implemented");
        } else if (this.cpuValidator(script)) {
            throw new Error("Not implemented");
        } else if (this.ioValidator(script)) {
            throw new Error("Not implemented");
        } else if (this.diskValidator(script)) {
            throw new Error("Not implemented");
        } else {
            throw new Error("Undefined schema");
        }
    }

    visitProcessScript(script: ProcessScript) {
        if (!script.filters) {
            throw new Error("Not implmented");
        } else if ("AND" in script.filters) {
            return this.visitAndCondition(script.filters as AndCondition);
        } else {
            return this.visitOrCondition(script.filters as OrCondition);
        }
    }

    visitAndCondition(script: AndCondition) {
        if (!script.AND) {
            throw new Error("Not implemented");
        }
        const numOperand = script.AND.length;
        const operands = script.AND.map((c) => this.visitCondition(c));
        return `AND ${numOperand} ${operands}`;
    }

    visitOrCondition(script: OrCondition) {
        if (!script.OR) {
            throw new Error("Not implemented");
        }
        const numOperand = script.OR.length;
        const operands = script.OR.map((c) => this.visitCondition(c));
        return `OR ${numOperand} ${operands}`;
    }

    visitCondition(script: Condition) {
        if (this.equalCondValidator(script)) {
            return this.visitEqCond(script);
        } else if (this.notEqCondValidator(script)) {
            throw new Error("Not implemented");
        } else if (this.likeCondValidator(script)) {
            throw new Error("Not implemented");
        }
    }

    visitEqCond(script: EqCondition) {
        const operands = Object.entries(script)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([k, v]) => `${k} ${v}`);
        return `AND ${operands.length} ${operands.join(" ")}`;
    }

    visitNotEqCond(script: NotEqCondition) {
        return script;
    }

    visitLikeCond(script: RegexCondition) {
        return script;
    }
}

export const scriptParser = new ScriptParser();
