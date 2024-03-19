import { Key as K, MouseKey as MK } from "../suchibot";
import { IKeyboardKey, IMouseKey, PhysicalKeyboardKey, PhysicalMouseKey } from "./physicalKey";
import { ScrollDownAsKey, ScrollUpAsKey } from "./scrollAsKey";

export const Key = (() => {
    const keys : Record<string, IKeyboardKey> = {};

    Object
        .entries(K)
        .forEach(([k, v]) => keys[k] = PhysicalKeyboardKey(v));

    return keys as { [k in keyof typeof K]: IKeyboardKey }
})();

export const MouseKey = (() => {
    const keys : Record<string, IMouseKey> = {};

    Object
        .entries(MK)
        .forEach(([k, v]) => keys[k] = PhysicalMouseKey(v));

    return keys as { [k in keyof typeof MK]: IMouseKey }
})()

export const ScrollKey = {
    UP: ScrollUpAsKey,
    DOWN: ScrollDownAsKey,
}
