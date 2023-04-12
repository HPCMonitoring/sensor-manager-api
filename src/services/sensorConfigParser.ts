import { MISSING_STATIC_CHECK } from "@constants";

const AND_OP = "&&";
const OR_OP = "||";
const EQ_OP = "==";
const LIKE_OP = "%=";

const NotEqOpMap: Record<NotEqOp, NotEqExpr> = {
    lt: "<",
    lte: "<=",
    gt: ">",
    gte: ">="
};

class FilterGenerator {
    private isEqCond(cond: Condition) {
        return (["gid", "parentPid", "pid", "uid"] as ProcessEqField[]).some((field) => field in cond);
    }
    private isNotEqCond(cond: Condition) {
        return (
            [
                "cpuTime",
                "cpuUsage",
                "ioRead",
                "ioWrite",
                "networkInBandwidth",
                "networkOutBandwidth",
                "physicalMemoryUsage",
                "virtualMemoryUsage"
            ] as ProcessNotEqField[]
        ).some((field) => field in cond);
    }
    private isLikeCond(cond: Condition) {
        return (["command", "executePath", "name"] as ProcessRegexField[]).some((field) => field in cond);
    }

    toPrefix(conds?: Condition[]) {
        if (!conds) return "";
        if (conds.length === 1) return this.visitCondition(conds[0]);
        return this.visitAndCondition({ AND: conds });
    }

    private visitAndCondition(condition: AndCondition): string {
        if (!condition.AND) throw new Error(MISSING_STATIC_CHECK);

        const numOperand = condition.AND.length;
        if (numOperand === 1) return this.visitCondition(condition.AND[0]);

        const operands = condition.AND.map((c) => this.visitCondition(c));
        return `${AND_OP} ${numOperand} ${operands.join(" ")}`;
    }

    private visitOrCondition(condition: OrCondition): string {
        if (!condition.OR) throw new Error(MISSING_STATIC_CHECK);

        const numOperand = condition.OR.length;
        if (numOperand === 1) return this.visitCondition(condition.OR[0]);

        const operands = condition.OR.map((c) => this.visitCondition(c));
        return `${OR_OP} ${numOperand} ${operands.join(" ")}`;
    }

    private visitCondition(cond: Condition): string {
        if (this.isEqCond(cond)) return this.visitEqCond(cond as EqCondition);
        else if (this.isNotEqCond(cond)) return this.visitNotEqCond(cond as NotEqCondition);
        else if (this.isLikeCond(cond)) return this.visitLikeCond(cond as RegexCondition);
        else if ("AND" in cond) return this.visitAndCondition(cond as AndCondition);
        else if ("OR" in cond) return this.visitOrCondition(cond as OrCondition);

        throw new Error(MISSING_STATIC_CHECK);
    }

    private visitEqCond(cond: EqCondition): string {
        const field = Object.keys(cond)[0] as ProcessEqField;
        const value = cond[field];
        if (!value) throw new Error(MISSING_STATIC_CHECK);

        return `${EQ_OP} ${field} ${value}`;
    }

    private visitNotEqCond(cond: NotEqCondition): string {
        const field = Object.keys(cond)[0] as ProcessNotEqField;
        const value = cond[field];
        if (!value) throw new Error(MISSING_STATIC_CHECK);

        const exprs = Object.keys(value)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map((key) => {
                const op = key as NotEqOp;
                const rhs = value[op];
                if (!rhs) throw new Error(MISSING_STATIC_CHECK);

                return `${NotEqOpMap[op]} ${field} ${value[op]}`;
            });
        if (exprs.length === 1) return exprs[0];
        return `${AND_OP} ${exprs.length} ${exprs.join(" ")}`;
    }

    private visitLikeCond(cond: RegexCondition): string {
        const field = Object.keys(cond)[0] as ProcessRegexField;
        const value = cond[field];
        if (!value) throw new Error(MISSING_STATIC_CHECK);

        return `${LIKE_OP} ${field} "${value.like}"`;
    }
}

export const filterGenerator = new FilterGenerator();
