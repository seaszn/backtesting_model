import { Evaluation } from "@/components/statisticsValue";

export function evaluateSharpe(value: number): Evaluation{
    if(value < 1){
        return Evaluation.Bad
    }
    else if(value <= 2){
        return Evaluation.Medium
    }

    return Evaluation.Good
}


export function evaluateSortino(value: number): Evaluation{
    if(value < 2){
        return Evaluation.Bad
    }
    else if(value <= 2.9){
        return Evaluation.Medium
    }

    return Evaluation.Good
}

export function evaluateOmega(value: number): Evaluation{
    if(value < 1.1){
        return Evaluation.Bad
    }
    else if(value <= 1.31){
        return Evaluation.Medium
    }

    return Evaluation.Good
}

export function evaluateProfitFactor(value: number): Evaluation{
    if(value < 2){
        return Evaluation.Bad
    }
    else if(value <= 4){
        return Evaluation.Medium
    }

    return Evaluation.Good
}

export function evaluateNTrades(value: number): Evaluation{
    if(value < 25 || value > 90){
        return Evaluation.Bad
    }
    else if(value <= 29){
        return Evaluation.Medium
    }

    return Evaluation.Good
}

export function evaluatePercentProfitable(value: number): Evaluation{
    if(value < 35){
        return Evaluation.Bad
    }
    else if(value <= 50){
        return Evaluation.Medium
    }

    return Evaluation.Good
}

export function evaluateIntraTradeDrawdown(value: number): Evaluation{
    if(value < 40){
        return Evaluation.Bad
    }
    else if(value >= 25){
        return Evaluation.Medium
    }

    return Evaluation.Good
}