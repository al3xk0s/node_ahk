import { IDisposable, IListenable, IObservable, Observable } from "./observable";

type RxSetValueOptions = {
    forceUpdate?: boolean;
}

export type RxOptions<T> = {
    comparer?: (value: T, newValue: T) => boolean;
    forceUpdate?: boolean;
}

export interface IRx<T> extends IListenable<T>, IDisposable {
    get value(): T;
    setValue(newValue: T, options?: RxSetValueOptions) : void;
}

export const Rx = <T>(initial: T, {
    comparer = (a, b) => a === b,
    forceUpdate: defaultForce = false,
}: RxOptions<T> = {}) : IRx<T> => {
    let value = initial;
    const obs = Observable<T>();

    return {
        get value() { return value; },
        setValue: (newValue, {forceUpdate = defaultForce} = {}) => {
            const oldValue = value;            
            value = newValue;        

            if(forceUpdate || !comparer(oldValue, newValue)) return obs.notify(value);
        },
        listen: obs.listen,
        dispose: obs.dispose,
    };
}
