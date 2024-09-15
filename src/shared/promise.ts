export abstract class PromiseUtils {
    private constructor() {}

    static readonly delayed = <T>(delayMs: number, executor?: () => T) => {
        return new Promise<any>((res) => {
            setTimeout(() => {
                if(executor != null) return res(executor());
                return res(undefined);
            }, delayMs);
        })
    }
};