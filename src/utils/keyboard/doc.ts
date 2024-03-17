import { IButton } from "../wrapper/button";
import { IPhysicalButton } from "../wrapper/physicalButton"
import { KeyByKeyProps } from "./types"
import '../../extensions/extensions';
import { inOfAny } from "../../shared/utils/operators";

export type WithDoc = {
    doc: AnyDoc;
}

export type AnyDoc = string | string[] | WithDoc | WithDoc[];

export const doc = (() => {
    const activate = (key: IButton) => `activate ${key.toString()}`;
    const tap = (key: IButton) => `tap ${key.toString()}`;
    const hold = (key: IButton) => `hold ${key.toString()}`;
    const tick = (key: IButton) => `tick ${key.toString()}`;

    const holdKey = ({when, then}: KeyByKeyProps<IPhysicalButton, IPhysicalButton>) =>
        `When ${activate(when)}, then ${hold(then)}`;

    const tapKey = ({when, then}: KeyByKeyProps<IPhysicalButton, IButton>) =>
        `When ${tap(when)}, then ${tap(then)}`;

    const tickKey = ({when, then}: KeyByKeyProps<IPhysicalButton, IButton>) =>
        `When ${activate(when)}, then ${tick(then)}`;

    const isWithDoc = (docs: AnyDoc) => inOfAny('doc', docs);

    const toStringArray = (docs: AnyDoc) : string[] => {
        if(typeof docs === 'string') return [docs];

        if(Array.isArray(docs)) return docs.map(e => toStringArray(e)).reduce(((acc, curr) => [...acc, ...curr]));

        if(isWithDoc(docs)) {
            // TODO: должна быть ошибка
            return toStringArray(docs.doc);
        }

        throw Error(`Value ${docs} int't doc`);
    }

    const join = (docs: AnyDoc) => toStringArray(docs).map(d => d).join('\n');
    const print = (docs: AnyDoc) => console.log(join(docs));
    
    return {
        holdKey,
        tapKey,
        tickKey,
        toStringArray,
        join,
        print,
        activate,
        tap,
        tick,
        hold,
        isWithDoc,
    }
})()
