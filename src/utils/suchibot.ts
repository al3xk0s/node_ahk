import { Key as K, MouseButton as M } from "suchibot";

type OmitedKeys = Omit<typeof K, 'PAGE_UP' | 'NUM_LOCK'>;

type Keys = { [k in keyof OmitedKeys]: SuchKey };
type MouseKeys = { [k in keyof typeof M]: SuchMouseKey };

export const SuchKey = (() => {
    const keys = {...K} as Partial<typeof K>;

    delete keys.PAGE_UP;
    delete keys.NUM_LOCK;

    return keys as Keys;
})()

export const SuchMouseKey = M as MouseKeys;

export type SuchKey = K & { __myType__: 'Key' };
export type SuchMouseKey = M & { __myType__: 'Mouse' };
