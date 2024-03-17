import { MouseEvent, Keyboard, Mouse, KeyboardModifierKeysState } from 'suchibot';
import { BoolState, IBoolState } from '../../shared/utils/boolState';
import { Handler, IButton, Listener, _commonButtonExt } from './button';
import { Key, MouseKey } from '../suchibot';

type ButtonType = 'keyboard' | 'mouse';

type ToggleEnabledOptions = { initialEnabled?: boolean, onDisable?: ToggleEnabledHandler; };
export type ToggleEnabledHandler = (state: IBoolState, modifiers: KeyboardModifierKeysState) => void;

interface IPhysicalButtonExt {
    onToggleEnabled(handler: ToggleEnabledHandler, options?: ToggleEnabledOptions) : Listener;
    holdTimed(holdTime: number) : Promise<void>;
}

type CreatePhysicalButtonExtProps = {
    onDown: (h: Handler) => Listener;
    hold: () => void;
    release: () => void;
}

const _physicalButtonExt = ({
    onDown,
    hold,
    release
}: CreatePhysicalButtonExtProps) : IPhysicalButtonExt => {
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

export interface IPhysicalButton<T extends Key | MouseKey = Key | MouseKey> extends IButton, IPhysicalButtonExt {
    onDown(handler: Handler) : Listener;
    onUp(handler: Handler) : Listener;
    isDown(): boolean;
    isUp(): boolean;
    hold() : void;
    release() : void;

    value: T;
    type: ButtonType;
}

export type IKeyboardButton = IPhysicalButton<Key>;

export interface IMouseKey extends IPhysicalButton<MouseKey> {
    onClick(handler: (event: MouseEvent) => void) : Listener;
    doubleClick() : void;
}

export const PhysicalKeyboardButton = (key: Key) : IKeyboardButton => {        
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
        ..._commonButtonExt(tap),
        ..._physicalButtonExt({hold, release, onDown}),
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
        ..._commonButtonExt(tap),
        ..._physicalButtonExt({hold, release, onDown}),
        type: 'mouse',
        toString: () => `${key} (mouse)`
    }
}
