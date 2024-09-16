import { KeyListener } from "@node-ahk/keys";
import { AnyDoc, WithDoc, DocUtils } from "./doc";
import { combineListeners, toListener } from "@node-ahk/utils";

/**
 * Скрипт с документацией в паре.
 */
export type ScriptWithDoc<T = KeyListener> = {
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

/**
 * Объединяет несколько скриптов в один скрипт.
 */
export const combineScriptsWithDoc = (scripts: ScriptWithDoc<void | (() => void) | KeyListener>[]) => {
    const call = () => {
        return combineListeners(scripts.map(s => toListener(s())))
    }

    return Object.assign(call, { doc: DocUtils.toStringArray(scripts) })
}

/**
 * Запускает скрипты с печатью документации.
 */
export const runScripts = (scripts: ScriptWithDoc<any>[]) => {
    scripts.forEach(s => s());
    scripts.forEach(s => DocUtils.print(s));
}
