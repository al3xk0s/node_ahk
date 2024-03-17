import { Key as K, MouseButton as M } from "suchibot";

const getKeys = () => {
    const keys = {...K} as Partial<typeof K>;

    delete keys.PAGE_UP;
    delete keys.NUM_LOCK;

    return keys as Keys;
}

type OmitedKeys = Omit<typeof K, 'PAGE_UP' | 'NUM_LOCK'>;

type Keys = { [k in keyof OmitedKeys]: Key };
type MouseKeys = { [k in keyof typeof M]: MouseKey };

export const Key = getKeys();
export const MouseKey = M as MouseKeys;

export type Key = K & { __myType__: 'Key' };
export type MouseKey = M & { __myType__: 'Mouse' };
