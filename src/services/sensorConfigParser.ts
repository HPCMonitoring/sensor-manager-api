import { equalCondition, likeCondition, notEqualCondition } from "@dtos/in";
import Ajv, { ValidateFunction } from "ajv";
const ajv = new Ajv({ allErrors: false, strict: false });

const AND_OP = "&&";
const OR_OP = "||";
const EQ_OP = "==";
const LIKE_OP = "%=";
type NotEqOp = "<" | "<=" | ">" | ">=";

const NotEqOpMap: Record<NotEqExpr, NotEqOp> = {
    lt: "<",
    lte: "<=",
    gt: ">",
    gte: ">="
};

class ScriptParser {
    private equalCondValidator: ValidateFunction<unknown>;
    private notEqCondValidator: ValidateFunction<unknown>;
    private likeCondValidator: ValidateFunction<unknown>;
    constructor() {
        this.equalCondValidator = ajv.compile(equalCondition.valueOf());
        this.notEqCondValidator = ajv.compile(notEqualCondition.valueOf());
        this.likeCondValidator = ajv.compile(likeCondition.valueOf());
    }

    toPrefixCommand(filters: AndCondition | OrCondition | undefined) {
        if (!filters) {
            throw new Error("Not implmented");
        } else if ("AND" in filters) {
            return this.visitAndCondition(filters as AndCondition);
        } else {
            return this.visitOrCondition(filters as OrCondition);
        }
    }

    private visitAndCondition(filters: AndCondition) {
        if (!filters.AND) {
            throw new Error("Not implemented");
        }
        const numOperand = filters.AND.length;
        const operands = filters.AND.map((c) => this.visitCondition(c));
        return `${AND_OP} ${numOperand} ${operands}`;
    }

    private visitOrCondition(filters: OrCondition) {
        if (!filters.OR) {
            throw new Error("Not implemented");
        }
        const numOperand = filters.OR.length;
        const operands = filters.OR.map((c) => this.visitCondition(c));
        return `${OR_OP} ${numOperand} ${operands}`;
    }

    private visitCondition(filters: Condition) {
        let expressions: string[] = [];
        if (this.equalCondValidator(filters)) {
            expressions = expressions.concat(this.visitEqCond(filters));
        } else if (this.notEqCondValidator(filters)) {
            expressions = expressions.concat(this.visitNotEqCond(filters));
        } else if (this.likeCondValidator(filters)) {
            expressions = expressions.concat(this.visitLikeCond(filters));
        }
        return `${AND_OP} ${expressions.length} ${expressions.join(" ")}`;
    }

    private visitEqCond(filters: EqCondition) {
        return Object.entries(filters)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([k, v]) => `${EQ_OP} ${k} ${v}`);
    }

    private visitNotEqCond(filters: NotEqCondition) {
        return Object.entries(filters)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .flatMap(([k, v]) =>
                Object.entries(v)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([k1, v1]) => `${NotEqOpMap[k1 as keyof typeof v]} ${k} ${v1}`)
            );
    }

    private visitLikeCond(filters: RegexCondition) {
        return Object.entries(filters)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([k, v]) => `${LIKE_OP} ${k} "${v.like}"`);
    }
}

export const scriptParser = new ScriptParser();
