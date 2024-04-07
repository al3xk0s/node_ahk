import { IPhysicalKey, Key } from "@node-ahk/keys";

export const defaultActivate = Key.NUMPAD_ADD;

export type WithActivate = { activate?: IPhysicalKey };
