
export function pascalCase(input: string) {
    let value = '';

    for(var val in input.split(' ')){
        value += val.charAt(0).toUpperCase() + val.slice(1);
    }

    return value;
}

export function valueToString<T>(value: T) {
    return `${value}`;
}