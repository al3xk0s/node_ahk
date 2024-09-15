import { MouseEvent, Keyboard, Mouse, KeyboardModifierKeysState } from 'suchibot';
import { BoolState, IBoolState } from '@node-ahk/shared/rx';
import { SuchKey, SuchMouseKey, combineListeners } from '@node-ahk/utils';
import { Handler, IKey, Listener, _commonKeyExt } from './key';
import { PromiseUtils } from '@node-ahk/shared';

type KeyType = 'keyboard' | 'mouse';

type ToggleEnabledOptions = { initialEnabled?: boolean, onDisable?: ToggleEnabledHandler; };
export type ToggleEnabledHandler = (state: IBoolState, modifiers: KeyboardModifierKeysState) => void;

interface IPhysicalKeyExt {
    onToggleEnabled(handler: ToggleEnabledHandler, options?: ToggleEnabledOptions) : Listener;
    onHold(handler: ToggleEnabledHandler, onDisable?: ToggleEnabledOptions['onDisable']) : Listener;
    holdTimed(holdTime: number) : Promise<void>;
}

type CreatePhysicalKeyExtProps = {
    onDown: (h: Handler) => Listener;
    onUp: (h: Handler) => Listener;
    hold: () => void;
    release: () => void;
}

const _physicalKeyExt = ({
    onDown,
    onUp,
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
        onHold: (handler, onDisable) => {
            const state = BoolState(false);

            return combineListeners([
                onDown((m) => {
                    if(state.isEnabled) return;
                    state.enable();
                    
                    handler(state, m);
                }),
                onUp((m) => {
                    state.disable();

                    onDisable?.(state, m);
                }),
            ]);
        },
        holdTimed: async (time) => {
            hold();
            await PromiseUtils.delayed(time);
            release();
        }
    }
}

export interface IPhysicalKey<T extends SuchKey | SuchMouseKey = SuchKey | SuchMouseKey> extends IKey, IPhysicalKeyExt {
    onDown(handler: Handler) : Listener;
    onUp(handler: Handler) : Listener;
    isDown(): boolean;
    isUp(): boolean;
    hold() : void;
    release() : void;

    value: T;
    type: KeyType;
}

export type IKeyboardKey = IPhysicalKey<SuchKey>;

export interface IMouseKey extends IPhysicalKey<SuchMouseKey> {
    onClick(handler: (event: MouseEvent) => void) : Listener;
    doubleClick() : void;
}

export const _PhysicalKeyboardKey = (key: SuchKey) : IKeyboardKey => {        
    const tap = () => Keyboard.tap(key);
    const onDown = (h: Handler) => Keyboard.onDown(key, (ev) => h(ev.modifierKeys));
    const onUp = (h: Handler) => Keyboard.onUp(key, (ev) => h(ev.modifierKeys));

    const hold = () => Keyboard.hold(key);
    const release = () => Keyboard.release(key);

    return {
        isDown: () => { return Keyboard.isDown(key) },
        isUp: () => { return Keyboard.isUp(key) },
        onDown,
        onUp,
        tap,
        hold,
        release,
        get value() { return key },
        ..._commonKeyExt(tap),
        ..._physicalKeyExt({hold, release, onDown, onUp}),
        type: 'keyboard',
        toString: () => `${key}`
    }
}

export const _PhysicalMouseKey = (key: SuchMouseKey) : IMouseKey => {
    const tap = () => Mouse.click(key);
    const onDown = (h: Handler) => Mouse.onDown(key, (ev) => h(ev.modifierKeys));
    const onUp = (h: Handler) => Mouse.onUp(key, (ev) => h(ev.modifierKeys));

    const hold = () => Mouse.hold(key);
    const release = () => Mouse.release(key);

    return {
        isDown: () => { return Mouse.isDown(key) },
        isUp: () => { return Mouse.isUp(key) },
        onDown,
        onUp,
        tap,
        hold,
        release,
        get value() { return key },
        onClick: (h) => Mouse.onClick(key, h),
        doubleClick: () => Mouse.doubleClick(key),
        ..._commonKeyExt(tap),
        ..._physicalKeyExt({hold, release, onDown, onUp}),
        type: 'mouse',
        toString: () => `${key} (mouse)`
    }
}
