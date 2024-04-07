import { SuchKey as K, SuchMouseKey as MK } from "@node-ahk/utils";
import { IKeyboardKey, IMouseKey, _PhysicalKeyboardKey, _PhysicalMouseKey } from "./physicalKey";
import { ScrollDownAsKey, ScrollUpAsKey } from "./scrollAsKey";

export const Key = (() => {
    const keys : Record<string, IKeyboardKey> = {};

    Object
        .entries(K)
        .forEach(([k, v]) => keys[k] = _PhysicalKeyboardKey(v));

    return keys as { [k in keyof typeof K]: IKeyboardKey }
})();

export const MouseKey = (() => {
    const keys : Record<string, IMouseKey> = {};

    Object
        .entries(MK)
        .forEach(([k, v]) => keys[k] = _PhysicalMouseKey(v));

    return keys as { [k in keyof typeof MK]: IMouseKey }
})();

export const ScrollKey = {
    UP: ScrollUpAsKey,
    DOWN: ScrollDownAsKey,
}
