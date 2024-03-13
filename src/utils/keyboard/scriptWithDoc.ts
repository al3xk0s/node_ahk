import { DisposeWrapper } from "../../shared/utils/observable";
import { inOfAny } from "../../shared/utils/operators";
import { Listener } from "../wrapper/button";
import { AnyDoc, WithDoc, doc } from "./doc";

export type ScriptWithDoc<T = Listener> = {
    (): T;
} & WithDoc;

type WrapToDocNamedProps<F extends (...args: Parameters<F>) => ReturnType<F>> = {
    getDoc: (...args: Parameters<F>) => AnyDoc;
}

export const wrapToScriptWithDoc = <F extends (...args: Parameters<F>) => ReturnType<F>>(
    foo: F,
    {getDoc} : WrapToDocNamedProps<F>,
) : ((...args: Parameters<F>) => ScriptWithDoc<ReturnType<F>>) => {
    
    return (...args: Parameters<F>) => {
        const call = () => foo(...args);

        return Object.assign(call, { doc: getDoc(...args) })
    }
}

export const combineScriptsWithDoc = (scripts: ScriptWithDoc<void | (() => void) | Listener>[]) => {
    const dw = DisposeWrapper();

    const call = () => {
        dw.addDisposers(scripts.map(l => {
            const res = l();

            if(typeof res === 'function') return res as (() => void);
            if(inOfAny('stop', res)) return (res as Listener).stop;

            return () => {};
        }));

        return {
            stop: () => dw.dispose()
        }
    }

    return Object.assign(call, { doc: doc.toStringArray(scripts) })
}

export const execScripts = (scripts: ScriptWithDoc<any>[]) => {
    scripts.forEach(s => s());
    scripts.forEach(s => doc.print(s));
}

