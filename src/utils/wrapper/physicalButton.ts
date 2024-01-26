import { MouseEvent, Key, MouseButton, Keyboard, Mouse, KeyboardModifierKeysState } from 'suchibot';
import { BoolState, IBoolState } from '../../shared/utils/boolState';
import { Handler, IButton, Listener, _commonButtonExt } from './button';

type ButtonType = 'keyboard' | 'mouse';

type ToggleEnabledOptions = { initialEnabled?: boolean, onDisable?: ToggleEnabledHandler; };
export type ToggleEnabledHandler = (state: IBoolState, modifiers: KeyboardModifierKeysState) => void;

interface IPhysicalButtonExt {
    onToggleEnabled(handler: ToggleEnabledHandler, options?: ToggleEnabledOptions) : Listener;
}

const _physicalButtonExt = (onDown: (h: Handler) => Listener) : IPhysicalButtonExt => {
    return {
        onToggleEnabled: (handler, {initialEnabled = false, onDisable} = {}) => {
            const state = BoolState(initialEnabled);

            return onDown((m) => {
                state.toggle();
                if(state.isEnabled) return handler(state, m);
                if(onDisable != null) return onDisable(state, m);
            });
        }
    }
}

export interface IPhysicalButton<T extends Key | MouseButton = Key | MouseButton> extends IButton, IPhysicalButtonExt {
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

export interface IMouseButton extends IPhysicalButton<MouseButton> {
    onClick(handler: (event: MouseEvent) => void) : Listener;
    doubleClick() : void;
}

export const PhysicalKeyboardButton = (key: Key) : IKeyboardButton => {
    const tap = () => Keyboard.tap(key);
    const onDown = (h: Handler) => Keyboard.onDown(key, (ev) => h(ev.modifierKeys));

    return {
        isDown: () => { return Keyboard.isDown(key) },
        isUp: () => { return Keyboard.isUp(key) },
        onDown,
        onUp: (h) => Keyboard.onUp(key, (ev) => h(ev.modifierKeys)),
        tap,
        hold: () => Keyboard.hold(key),
        release: () => Keyboard.release(key),
        get value() { return key },
        ..._commonButtonExt(tap),
        ..._physicalButtonExt(onDown),
        type: 'keyboard',
    }
}

export const PhysicalMouseButton = (key: MouseButton) : IMouseButton => {
    const tap = () => Mouse.click(key);
    const onDown = (h: Handler) => Mouse.onDown(key, (ev) => h(ev.modifierKeys));

    return {
        isDown: () => { return Mouse.isDown(key) },
        isUp: () => { return Mouse.isUp(key) },
        onDown,
        onUp: (h) => Mouse.onUp(key, (ev) => h(ev.modifierKeys)),
        tap,
        hold: () => Mouse.hold(key),
        release: () => Mouse.release(key),
        get value() { return key },
        onClick: (h) => Mouse.onClick(key, h),
        doubleClick: () => Mouse.doubleClick(key),
        ..._commonButtonExt(tap),
        ..._physicalButtonExt(onDown),
        type: 'mouse',
    }
}
