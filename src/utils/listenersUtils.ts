import { KeyListener } from "@node-ahk/keys"
import { inOfAny } from "@node-ahk/shared/operators";
import { DisposeWrapper, Disposer } from "@node-ahk/shared/rx";


export const toDisposer = (res: any) : Disposer  => {
    if(typeof res === 'function') return () => void res();
    if(inOfAny('stop', res)) return () => (res as KeyListener).stop();

    return () => {};
}

export const toListener = (res: any) : KeyListener => ({ stop: toDisposer(res) });

export const combineDisposers = (disposers: Disposer[]) => {
    const dw = DisposeWrapper();
    dw.addDisposers(disposers);

    return toDisposer(dw.dispose);
}

export const combineListeners = (listeners: KeyListener[]) =>
    toListener(combineDisposers(listeners.map(toDisposer)));
