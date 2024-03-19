import { IKey } from "../wrapper/key";
import { IPhysicalKey } from "../wrapper/physicalKey"
import { KeyByKeyProps } from "./types"
import '../../extensions/extensions';
import { inOfAny } from "../../shared/utils/operators";

export type WithDoc = {
    doc: AnyDoc;
}

export type AnyDoc = string | string[] | WithDoc | WithDoc[];

export const doc = (() => {
    const activate = (key: IKey) => `activate ${key.toString()}`;
    const tap = (key: IKey) => `tap ${key.toString()}`;
    const hold = (key: IKey) => `hold ${key.toString()}`;
    const tick = (key: IKey) => `tick ${key.toString()}`;

    const holdKey = ({when, then}: KeyByKeyProps<IPhysicalKey, IPhysicalKey>) =>
        `When ${activate(when)}, then ${hold(then)}`;

    const tapKey = ({when, then}: KeyByKeyProps<IPhysicalKey, IKey>) =>
        `When ${tap(when)}, then ${tap(then)}`;

    const tickKey = ({when, then}: KeyByKeyProps<IPhysicalKey, IKey>) =>
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
