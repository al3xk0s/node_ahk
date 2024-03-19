import { v4 as uuid } from 'uuid';

export type Listener<T> = (value: T) => any;
export type Disposer = () => void;

export interface IDisposable {
    dispose() : void;
}

export interface IListenable<T> {
    listen(listener: Listener<T>) : Disposer;
}

export interface IObservable<T> extends IListenable<T>, IDisposable {
    notify(value: T) : void;
}

export const Observable = <T>() : IObservable<T> => {
    const map = new Map<string, Listener<T>>();

    return {
        listen: (h) => {
            const id = uuid();
            map.set(id, h);

            return () => map.delete(id);
        },
        notify: (val) => {
            for(const v of map.values()) {
                v(val);
            }
        },
        dispose: () => map.clear(),
    };
}

export interface IDisposeWrapper extends IDisposable {
    addDisposer(disposer: Disposer) : void;
    addDisposers(disposer: Disposer[]) : void;
}

export const DisposeWrapper = () : IDisposeWrapper => {
    let disposers : Disposer[] = [];

    const addDisposer = (d: Disposer) => disposers.push(d);

    return {
        addDisposer,
        addDisposers: (ds) => ds.forEach(addDisposer),
        dispose: () => disposers = [],
    }
}
