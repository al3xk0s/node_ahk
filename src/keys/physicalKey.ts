import { MouseEvent, Keyboard, Mouse, KeyboardModifierKeysState, sleep } from 'suchibot';
import { BoolState, IBoolState } from '@node-ahk/shared/rx';
import { SuchKey, SuchMouseKey, combineListeners } from '@node-ahk/utils';
import { Handler, IKey, Listener, _commonKeyExt } from './key';

type KeyType = 'keyboard' | 'mouse';

type ToggleOptions = { initialEnabled?: boolean, onDisable?: ToggleHandler; };
export type ToggleHandler = (state: IBoolState, modifiers: KeyboardModifierKeysState) => void;

interface IPhysicalKeyExt {
    /**
     * Событие поочередного переключения кнопки из состояний активной / неактивной (1 нажатие - 1 переключение).
     *      
     * @param handler вызывается в случае переключения в `активное` состояние.
     * @param options.initialEnabled позводяет задать начальное состояние.
     * @param options.onDisable вызывается в случае переключения в `неактивное` состояние.
     */
    onToggleEnabled(handler: ToggleHandler, options?: ToggleOptions) : Listener;

    /**
     * Событие зажатия и отпускания кнопки.
     *
     * @param handler вызывается в случае зажатия кнопки.
     * @param options.onDisable вызывается в случае отпускания кнопки.
     */
    onHold(handler: ToggleHandler, options?: Pick<ToggleOptions, 'onDisable'>) : Listener;

    /**
     * Зажать кнопку на заданное время.
     * 
     * @param holdTime время зажатия кноки в миллисекундах.
     */
    holdOnTime(holdTime: number) : Promise<void>;
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
                return onDisable?.(state, m);
            });
        },
        onHold: (handler, { onDisable } = {}) => {
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
        holdOnTime: async (time) => {
            hold();
            await sleep(time);
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

export interface IPhysicalKeySequence<T extends SuchKey | SuchMouseKey = SuchKey | SuchMouseKey> extends IPhysicalKey<T> {

}

const DefaultModifierKeysState = {
    alt: false,
    control: false,
    shift: false,
    super: false,
    windows: false,
    command: false,
    meta: false,
    leftAlt: false,
    leftControl: false,
    leftShift: false,
    leftSuper: false,
    leftWindows: false,
    leftCommand: false,
    leftMeta: false,
    rightAlt: false,
    rightControl: false,
    rightShift: false,
    rightSuper: false,
    rightWindows: false,
    rightCommand: false,
    rightMeta: false,
}

export const _PhysicalKeySequence = <
    T extends SuchKey | SuchMouseKey = SuchKey | SuchMouseKey
>(keys: IPhysicalKey<T>[]) : IPhysicalKeySequence<T> => {
    if(keys.length <= 0) throw new Error('Empty key sequence');

    const tap = () => keys.forEach(k => k.tap());
    const hold = () => keys.forEach(k => k.hold());
    const release = () => keys.forEach(k => k.release());

    const onWatchChanges = (
        handler: Handler,
        getEvent: (key: IPhysicalKey) => IPhysicalKey['onDown'],
        isValidKeyCondition: (key: IPhysicalKey) => boolean
    ) : Listener => {
        const firstKey = keys[0];
        const secondKeys = keys.slice(1);

        if(secondKeys.length == 0) return getEvent(firstKey)(handler);

        return getEvent(firstKey)(() => {
            if(secondKeys.every(isValidKeyCondition)) handler(DefaultModifierKeysState);
        });
    }

    const onDown = (handler: Handler) : Listener =>
        onWatchChanges(handler, key => key.onDown, key => key.isDown());

    const onUp = (handler: Handler) : Listener =>
        onWatchChanges(handler, key => key.onUp, key => key.isUp());

    const keysToString = () =>
        keys.map(k => k.value).join(' + ');

    return {
        isDown: () => keys.every(k => k.isDown()),
        isUp: () => keys.every(k => k.isUp()),
        onDown,
        onUp,
        tap,
        hold,
        release,
        get value() { return keysToString() as T },
        ..._commonKeyExt(tap),
        ..._physicalKeyExt({hold, release, onDown, onUp}),
        type: 'keyboard',
        toString: () => `${keysToString()}`
    }
}

