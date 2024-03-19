export type ICast<T> = ReturnType<typeof Cast<T>>;

export const Cast = <T>(value: any, match: (value: any) => boolean, typeName: string) => {
    return {
        match,
        typeName,
        cast: () => {
            if(!match(value)) throw new Error(`Value ${value} is not type ${typeName}`);
            return value as T;
        },
        tryCast: () => {
            if(!match(value)) return undefined;
            return value;
        },
    };
}
