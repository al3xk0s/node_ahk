export const force = <T>(value: T | undefined | null) => {
    if(value == null) throw new Error('Value is not exist')

    return value;
}

export const inOfAny = (key: string, value: any) => {
    try {
        return key in value;
    } catch(e) {
        return false;
    }
};
