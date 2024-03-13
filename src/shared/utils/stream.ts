import { force } from "./operators";

export interface IStream<T> {
    map<V>(mapper: (value: T, index: number) => V) : IStream<V>;
    filter(predicate: (value: T, index: number) => boolean) : IStream<T>;
    forEach(executor: (value: T, index: number) => any) : IStream<T>;

    get count() : number;

    get first() : T;
    get last() : T;

    get firstOrNull() : T | undefined;
    get lastOrNull() : T | undefined;

    toArray() : T[];
}

export const stream = <T>(source: Iterable<T> | (() => Iterable<T>)) : IStream<T> => {
    const getSource = typeof source !== 'function' ? () => source : source;

    return {
        forEach(executor) {
            let i = 0;
            for(const v of getSource()) {
                executor(v, i);
                i++;
            }

            return this;
        },

        map: (mapper) => stream(function* gen() {
            let i = 0;
            for (const v of getSource()) {
                yield mapper(v, i);
                i++;
            }
        }),
        filter: (predicate) => stream(function* gen() {
            let i = 0;
            for(const v of getSource()) {                
                if(predicate(v, i)) yield v;
                i++;
            }
        }),
        get count() {
            let i = 0;
            for(const v of getSource()) {
                i++;
            };

            return i;
        },
        toArray: () => {
            const result : T[] = [];
            for(const v of getSource()) {
                result.push(v);
            }

            return result;
        },
        get first() { return force(this.firstOrNull); },
        get last() { return force(this.lastOrNull); },

        get firstOrNull() {
            for(const v of getSource()) {
                return v;
            }

            return undefined;
        },

        get lastOrNull() {
            let last : T | undefined = undefined;

            for(const v of getSource()) {
                last = v;
            }

            return last;
        }
    }
}
