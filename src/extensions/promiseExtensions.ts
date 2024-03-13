declare interface PromiseConstructor {
    delayed<T>(delayMs: number, executor: () => T) : Promise<T>;
    delayed(delayMs: number, executor: () => void) : Promise<void>;
    delayed(delayMs: number) : Promise<void>;
}

Promise.delayed = function<T = void>(delayMs: number, executor?: () => T) {
    return new Promise<any>((res) => {
        setTimeout(() => {
            if(executor != null) return res(executor());
            return res(undefined);
        }, delayMs);
    })
}
