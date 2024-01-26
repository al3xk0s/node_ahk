const force = <T>(value: T | undefined | null) => {
    if(value == null) throw new Error('Value is not exist')

    return value;
}