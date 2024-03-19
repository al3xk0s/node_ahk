import { MouseEvent, Keyboard, Mouse, KeyboardModifierKeysState } from 'suchibot';
import { BoolState, IBoolState } from '../../shared/utils/boolState';
import { Handler, IKey, Listener, _commonKeyExt } from './key';
import { Key, MouseKey } from '../suchibot';

type KeyType = 'keyboard' | 'mouse';

type ToggleEnabledOptions = { initialEnabled?: boolean, onDisable?: ToggleEnabledHandler; };
export type ToggleEnabledHandler = (state: IBoolState, modifiers: KeyboardModifierKeysState) => void;

interface IPhysicalKeyExt {
    onToggleEnabled(handler: ToggleEnabledHandler, options?: ToggleEnabledOptions) : Listener;
    holdTimed(holdTime: number) : Promise<void>;
}

type CreatePhysicalKeyExtProps = {
    onDown: (h: Handler) => Listener;
    hold: () => void;
    release: () => void;
}

const _physicalKeyExt = ({
    onDown,
    hold,
    release
}: CreatePhysicalKeyExtProps) : IPhysicalKeyExt => {
    return {
        onToggleEnabled: (handler, {initialEnabled = false, onDisable} = {}) => {
            const state = BoolState(initialEnabled);

            return onDown((m) => {
                state.toggle();
                if(state.isEnabled) return handler(state, m);
                if(onDisable != null) return onDisable(state, m);
            });
        },
        holdTimed: async (time) => {
            hold();
            await Promise.delayed(time);
            release();
        }
    }
}

export interface IPhysicalKey<T extends Key | MouseKey = Key | MouseKey> extends IKey, IPhysicalKeyExt {
    onDown(handler: Handler) : Listener;
    onUp(handler: Handler) : Listener;
    isDown(): boolean;
    isUp(): boolean;
    hold() : void;
    release() : void;

    value: T;
    type: KeyType;
}

export type IKeyboardKey = IPhysicalKey<Key>;

export interface IMouseKey extends IPhysicalKey<MouseKey> {
    onClick(handler: (event: MouseEvent) => void) : Listener;
    doubleClick() : void;
}

export const PhysicalKeyboardKey = (key: Key) : IKeyboardKey => {        
    const tap = () => Keyboard.tap(key);
    const onDown = (h: Handler) => Keyboard.onDown(key, (ev) => h(ev.modifierKeys));

    const hold = () => Keyboard.hold(key);
    const release = () => Keyboard.release(key);

    return {
        isDown: () => { return Keyboard.isDown(key) },
        isUp: () => { return Keyboard.isUp(key) },
        onDown,
        onUp: (h) => Keyboard.onUp(key, (ev) => h(ev.modifierKeys)),
        tap,
        hold,
        release,
        get value() { return key },
        ..._commonKeyExt(tap),
        ..._physicalKeyExt({hold, release, onDown}),
        type: 'keyboard',
        toString: () => `${key}`
    }
}

export const PhysicalMouseKey = (key: MouseKey) : IMouseKey => {
    const tap = () => Mouse.click(key);
    const onDown = (h: Handler) => Mouse.onDown(key, (ev) => h(ev.modifierKeys));

    const hold = () => Mouse.hold(key);
    const release = () => Mouse.release(key);

    return {
        isDown: () => { return Mouse.isDown(key) },
        isUp: () => { return Mouse.isUp(key) },
        onDown,
        onUp: (h) => Mouse.onUp(key, (ev) => h(ev.modifierKeys)),
        tap,
        hold,
        release,
        get value() { return key },
        onClick: (h) => Mouse.onClick(key, h),
        doubleClick: () => Mouse.doubleClick(key),
        ..._commonKeyExt(tap),
        ..._physicalKeyExt({hold, release, onDown}),
        type: 'mouse',
        toString: () => `${key} (mouse)`
    }
}
