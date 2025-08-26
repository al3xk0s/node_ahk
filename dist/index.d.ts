import { Key as Key$1, MouseButton, KeyboardModifierKeysState, MouseEvent } from 'suchibot';
export { sleep } from 'suchibot';

interface IStream<T> {
    map<V>(mapper: (value: T, index: number) => V): IStream<V>;
    filter(predicate: (value: T, index: number) => boolean): IStream<T>;
    forEach(executor: (value: T, index: number) => any): IStream<T>;
    get count(): number;
    get first(): T;
    get last(): T;
    get firstOrNull(): T | undefined;
    get lastOrNull(): T | undefined;
    toArray(): T[];
}
declare const stream: <T>(source: Iterable<T> | (() => Iterable<T>)) => IStream<T>;

interface IQueue<T> {
    pop(): T | undefined;
    popAll(): Iterable<T>;
    push(value: T): void;
    get canPop(): boolean;
    get length(): number;
    get isEmpty(): boolean;
    toArray(): Iterable<T>;
    stream(): IStream<T>;
}
declare class Queue<T> implements IQueue<T> {
    static from<T>(values: Iterable<T>): IQueue<T>;
    pop(): T | undefined;
    popAll(): Iterable<T>;
    push(value: T): void;
    get isEmpty(): boolean;
    get canPop(): boolean;
    get length(): number;
    private _head?;
    private _tail?;
    toArray(): Generator<T, void, unknown>;
    stream(): IStream<T>;
}

declare abstract class StringUtils {
    private constructor();
    static readonly toTitleCase: (source: string) => string;
}

declare abstract class PromiseUtils {
    private constructor();
    static readonly delayed: <T>(delayMs: number, executor?: () => T) => Promise<any>;
    static readonly microtask: <T>(executor: () => T) => Promise<any>;
}

type TimerProps = {
    durationMs: number;
    onStart?: () => void;
    onStop?: () => void;
};
declare const createTimer: ({ durationMs, onStart, onStop }: TimerProps) => {
    start: () => Promise<void>;
    stop: () => void;
};
type Timer = ReturnType<typeof createTimer>;
declare const createTimerSequence: ({ onStart, onStop }: Omit<TimerProps, "durationMs">, ...timers: Timer[]) => Timer;

type ICast<T> = ReturnType<typeof Cast<T>>;
declare const Cast: <T>(value: any, match: (value: any) => boolean, typeName: string) => {
    match: (value: any) => boolean;
    typeName: string;
    cast: () => T;
    tryCast: () => any;
};

declare const force: <T>(value: T | undefined | null) => NonNullable<T>;
declare const inOfAny: (key: string, value: any) => boolean;

type Listener$1<T> = (value: T) => any;
type Disposer = () => void;
interface IDisposable {
    dispose(): void;
}
interface IListenable<T> {
    listen(listener: Listener$1<T>): Disposer;
}
interface IObservable<T> extends IListenable<T>, IDisposable {
    notify(value: T): void;
}
declare const Observable: <T>() => IObservable<T>;
interface IDisposeWrapper extends IDisposable {
    addDisposer(disposer: Disposer): void;
    addDisposers(disposer: Disposer[]): void;
}
declare const DisposeWrapper: () => IDisposeWrapper;

type RxSetValueOptions = {
    forceUpdate?: boolean;
};
type RxOptions<T> = {
    comparer?: (value: T, newValue: T) => boolean;
    forceUpdate?: boolean;
};
interface IRx<T> extends IListenable<T>, IDisposable {
    get value(): T;
    setValue(newValue: T, options?: RxSetValueOptions): void;
}
declare const Rx: <T>(initial: T, { comparer, forceUpdate: defaultForce, }?: RxOptions<T>) => IRx<T>;

interface IBoolState extends IRx<boolean> {
    toggle(): void;
    enable(): void;
    disable(): void;
    get isEnabled(): boolean;
}
declare const BoolState: (initial?: boolean, options?: RxOptions<boolean>) => IBoolState;
declare const BoolStateCompose: {
    onlyOneActive: (...states: IBoolState[]) => IDisposeWrapper;
};

type OmitedKeys = Omit<typeof Key$1, 'PAGE_UP' | 'NUM_LOCK'>;
type Keys = {
    [k in keyof OmitedKeys]: SuchKey;
};
type MouseKeys = {
    [k in keyof typeof MouseButton]: SuchMouseKey;
};
declare const SuchKey: Keys;
type SuchKey = Key$1 & {
    __myType__: 'Key';
};
declare const SuchMouseKey: MouseKeys;
type SuchMouseKey = MouseButton & {
    __myType__: 'Mouse';
};

declare const toDisposer: (res: any) => Disposer;
declare const toListener: (res: any) => Listener;
declare const combineDisposers: (disposers: Disposer[]) => Disposer;
declare const combineListeners: (listeners: Listener[]) => Listener;

type WhenKeyProps<B = IPhysicalKey> = {
    when: B;
};
type KeyByKeyProps<B = IPhysicalKey, T = IKey> = {
    then: T;
} & WhenKeyProps<B>;

/**
 * @param when - переключает состояние скрипта (активное / неактивное).
 * @param then - при активном состоянии будет зажата.
 */
declare const holdKey: ({ when, then }: KeyByKeyProps<IPhysicalKey, IPhysicalKey>) => Listener;
/**
 * Версия со встроенной документацией.
 *
 * @returns функция {@link holdKey}.
 */
declare const getHoldKey: (args_0: KeyByKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>, IPhysicalKey<SuchKey | SuchMouseKey>>) => ScriptWithDoc<Listener>;

/**
 * По нажатию на `when` происходит нажатие клавиши `then`.
 */
declare const tapKey: ({ when, then }: KeyByKeyProps<IPhysicalKey, IKey>) => Listener;
/**
 * Версия с документацией.
 *
 * @returns функция {@link tapKey}.
 */
declare const getTapKey: (args_0: KeyByKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>, IKey>) => ScriptWithDoc<Listener>;

type TickKeyProps = {
    delayMs?: number;
} & KeyByKeyProps<IPhysicalKey, IKey>;
/**
 * @param when переключает состояние скрипта (активное / неактивное).
 * @param then при активном состоянии скрипта с определенной периодичностью совершаются нажатия.
 * @param delayMs задержка между тиками.
 */
declare const tickKey: ({ when, then, delayMs, }: TickKeyProps) => Listener;
/**
 * Версия с документацией.
 *
 * @returns функция {@link tickKey}
 */
declare const getTickKey: (args_0: TickKeyProps) => ScriptWithDoc<Listener>;
/**
 * @param activate переключает состояние между активным / неактивным.
 * @param when в случае активного состояния, при зажатии клавиши происходит многократное нажатие `then`.
 *
 * @returns функция с документацией.
 */
declare const getTickByHold: (args_0: {
    then: IKey;
} & WhenKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>> & {
    activate: IPhysicalKey;
}) => ScriptWithDoc<Listener>;

type ToggleStateByTapProps = {
    initial?: boolean;
    key: IPhysicalKey;
};
/**
 * Скриптовый вариант {@link IPhysicalKey.onToggleEnabled}.
 *
 * @returns стейт, хранящий состояние кнопки (активное / неактивное).
 */
declare const toggleStateByTap: ({ initial, key, }: ToggleStateByTapProps) => IBoolState;

type ContinuePredicate = (count: number) => boolean;
type WhileAsyncProps = {
    delayMs?: number;
};
type WhilePredicateProps = {
    needContinue: ContinuePredicate;
};
type BasicWhileNeedProps = {
    execute: () => any;
} & WhilePredicateProps;
type WhileNeedProps = BasicWhileNeedProps & WhileAsyncProps;
/**
 * Выполнение определенного действия, пока выполняется условие.
 *
 * @param needContinue функция, вызывающаяся каждую итерацию цикла.
 * @param execute выполняемое действие.
 * @param delayMs задержка после выполнения действия.
 */
declare const whileNeed: ({ needContinue, execute, delayMs, }: WhileNeedProps) => Promise<void>;
type WhileNeedAsyncProps = {
    execute: () => Promise<any>;
} & BasicWhileNeedProps & WhileAsyncProps;
/**
 * Выполнение асинхронного действия, пока выполняется условие.
 *
 * Является аналогом {@link whileNeed}.
 */
declare const whileNeedAsync: ({ needContinue, execute, delayMs, }: WhileNeedAsyncProps) => Promise<void>;

type Listener = {
    stop: () => any;
};
type Handler = (modifiers: KeyboardModifierKeysState) => void;
type SimpleHandler = () => void;
type AsyncTickProps = WhileAsyncProps;
type TickProps = AsyncTickProps;
interface IKeyExtentions {
    tick(props?: TickProps): void;
    onTickStart(handler: SimpleHandler): void;
    onTickRelease(handler: SimpleHandler): void;
    releaseTick(): void;
    isTicked(): boolean;
}
interface IKey extends IKeyExtentions {
    tap(): void;
    toString(): string;
}

declare enum ScrollDirection {
    up = 1,
    down = -1
}
interface IScrollAsKey extends IKey {
    readonly step: number;
    readonly direction: ScrollDirection;
}

type KeyType = 'keyboard' | 'mouse';
type ToggleOptions = {
    initialEnabled?: boolean;
    onDisable?: ToggleHandler;
};
type ToggleHandler = (state: IBoolState, modifiers: KeyboardModifierKeysState) => void;
interface IPhysicalKeyExt {
    /**
     * Событие поочередного переключения кнопки из состояний активной / неактивной (1 нажатие - 1 переключение).
     *
     * @param handler вызывается в случае переключения в `активное` состояние.
     * @param options.initialEnabled позводяет задать начальное состояние.
     * @param options.onDisable вызывается в случае переключения в `неактивное` состояние.
     */
    onToggleEnabled(handler: ToggleHandler, options?: ToggleOptions): Listener;
    /**
     * Событие зажатия и отпускания кнопки.
     *
     * @param handler вызывается в случае зажатия кнопки.
     * @param options.onDisable вызывается в случае отпускания кнопки.
     */
    onHold(handler: ToggleHandler, options?: Pick<ToggleOptions, 'onDisable'>): Listener;
    /**
     * Зажать кнопку на заданное время.
     *
     * @param holdTime время зажатия кноки в миллисекундах.
     */
    holdOnTime(holdTime: number): Promise<void>;
}
interface IPhysicalKey<T extends SuchKey | SuchMouseKey = SuchKey | SuchMouseKey> extends IKey, IPhysicalKeyExt {
    onDown(handler: Handler): Listener;
    onUp(handler: Handler): Listener;
    isDown(): boolean;
    isUp(): boolean;
    hold(): void;
    release(): void;
    value: T;
    type: KeyType;
}
type IKeyboardKey = IPhysicalKey<SuchKey>;
interface IMouseKey extends IPhysicalKey<SuchMouseKey> {
    onClick(handler: (event: MouseEvent) => void): Listener;
    doubleClick(): void;
}
interface IPhysicalKeySequence<T extends SuchKey | SuchMouseKey = SuchKey | SuchMouseKey> extends IPhysicalKey<T> {
}

declare const Key: {
    BACKSPACE: IKeyboardKey;
    DELETE: IKeyboardKey;
    ENTER: IKeyboardKey;
    TAB: IKeyboardKey;
    ESCAPE: IKeyboardKey;
    UP: IKeyboardKey;
    DOWN: IKeyboardKey;
    RIGHT: IKeyboardKey;
    LEFT: IKeyboardKey;
    HOME: IKeyboardKey;
    INSERT: IKeyboardKey;
    END: IKeyboardKey;
    PAGE_DOWN: IKeyboardKey;
    SPACE: IKeyboardKey;
    F1: IKeyboardKey;
    F2: IKeyboardKey;
    F3: IKeyboardKey;
    F4: IKeyboardKey;
    F5: IKeyboardKey;
    F6: IKeyboardKey;
    F7: IKeyboardKey;
    F8: IKeyboardKey;
    F9: IKeyboardKey;
    F10: IKeyboardKey;
    F11: IKeyboardKey;
    F12: IKeyboardKey;
    F13: IKeyboardKey;
    F14: IKeyboardKey;
    F15: IKeyboardKey;
    F16: IKeyboardKey;
    F17: IKeyboardKey;
    F18: IKeyboardKey;
    F19: IKeyboardKey;
    F20: IKeyboardKey;
    F21: IKeyboardKey;
    F22: IKeyboardKey;
    F23: IKeyboardKey;
    F24: IKeyboardKey;
    LEFT_ALT: IKeyboardKey;
    LEFT_CONTROL: IKeyboardKey;
    LEFT_SHIFT: IKeyboardKey;
    RIGHT_ALT: IKeyboardKey;
    RIGHT_CONTROL: IKeyboardKey;
    RIGHT_SHIFT: IKeyboardKey;
    LEFT_WINDOWS: IKeyboardKey;
    LEFT_COMMAND: IKeyboardKey;
    LEFT_META: IKeyboardKey;
    LEFT_SUPER: IKeyboardKey;
    RIGHT_WINDOWS: IKeyboardKey;
    RIGHT_COMMAND: IKeyboardKey;
    RIGHT_META: IKeyboardKey;
    RIGHT_SUPER: IKeyboardKey;
    PRINT_SCREEN: IKeyboardKey;
    VOLUME_DOWN: IKeyboardKey;
    VOLUME_UP: IKeyboardKey;
    MUTE: IKeyboardKey;
    PAUSE_BREAK: IKeyboardKey;
    NUMPAD_0: IKeyboardKey;
    NUMPAD_1: IKeyboardKey;
    NUMPAD_2: IKeyboardKey;
    NUMPAD_3: IKeyboardKey;
    NUMPAD_4: IKeyboardKey;
    NUMPAD_5: IKeyboardKey;
    NUMPAD_6: IKeyboardKey;
    NUMPAD_7: IKeyboardKey;
    NUMPAD_8: IKeyboardKey;
    NUMPAD_9: IKeyboardKey;
    NUMPAD_MULTIPLY: IKeyboardKey;
    NUMPAD_ADD: IKeyboardKey;
    NUMPAD_SUBTRACT: IKeyboardKey;
    NUMPAD_DECIMAL: IKeyboardKey;
    NUMPAD_DIVIDE: IKeyboardKey;
    NUMPAD_ENTER: IKeyboardKey;
    CAPS_LOCK: IKeyboardKey;
    SCROLL_LOCK: IKeyboardKey;
    SEMICOLON: IKeyboardKey;
    EQUAL: IKeyboardKey;
    COMMA: IKeyboardKey;
    MINUS: IKeyboardKey;
    PERIOD: IKeyboardKey;
    SLASH: IKeyboardKey;
    BACKTICK: IKeyboardKey;
    LEFT_BRACKET: IKeyboardKey;
    BACKSLASH: IKeyboardKey;
    RIGHT_BRACKET: IKeyboardKey;
    QUOTE: IKeyboardKey;
    A: IKeyboardKey;
    B: IKeyboardKey;
    C: IKeyboardKey;
    D: IKeyboardKey;
    E: IKeyboardKey;
    F: IKeyboardKey;
    G: IKeyboardKey;
    H: IKeyboardKey;
    I: IKeyboardKey;
    J: IKeyboardKey;
    K: IKeyboardKey;
    L: IKeyboardKey;
    M: IKeyboardKey;
    N: IKeyboardKey;
    O: IKeyboardKey;
    P: IKeyboardKey;
    Q: IKeyboardKey;
    R: IKeyboardKey;
    S: IKeyboardKey;
    T: IKeyboardKey;
    U: IKeyboardKey;
    V: IKeyboardKey;
    W: IKeyboardKey;
    X: IKeyboardKey;
    Y: IKeyboardKey;
    Z: IKeyboardKey;
    ZERO: IKeyboardKey;
    ONE: IKeyboardKey;
    TWO: IKeyboardKey;
    THREE: IKeyboardKey;
    FOUR: IKeyboardKey;
    FIVE: IKeyboardKey;
    SIX: IKeyboardKey;
    SEVEN: IKeyboardKey;
    EIGHT: IKeyboardKey;
    NINE: IKeyboardKey;
    ANY: IKeyboardKey;
};
declare const MouseKey: {
    LEFT: IMouseKey;
    RIGHT: IMouseKey;
    MIDDLE: IMouseKey;
    MOUSE4: IMouseKey;
    MOUSE5: IMouseKey;
    ANY: IMouseKey;
};
declare const KeysSequence: <T extends SuchKey | SuchMouseKey = SuchKey | SuchMouseKey>(keys: IPhysicalKey<T>[]) => IPhysicalKeySequence<T>;
declare const ScrollKey: {
    UP: (step?: number) => IScrollAsKey;
    DOWN: (step?: number) => IScrollAsKey;
};

/**
 * Функция преобразования x [0; 1] в t [0; 1].
 */
type EasingFunction = (x: number) => number;
/**
 * https://easings.net
 */
declare const EasingFunctions: {
    easeInSine: (x: number) => number;
    easeOutSine: (x: number) => number;
    easeInOutSine: (x: number) => number;
    easeInQuad: (x: number) => number;
    easeOutQuad: (x: number) => number;
    easeInOutQuad: (x: number) => number;
    easeInCubic: (x: number) => number;
    easeOutCubic: (x: number) => number;
    easeInOutCubic: (x: number) => number;
    easeInQuart: (x: number) => number;
    easeOutQuart: (x: number) => number;
    easeInOutQuart: (x: number) => number;
    easeInQuint: (x: number) => number;
    easeOutQuint: (x: number) => number;
    easeInOutQuint: (x: number) => number;
    easeInExpo: (x: number) => number;
    easeOutExpo: (x: number) => number;
    easeInOutExpo: (x: number) => number;
    easeInCirc: (x: number) => number;
    easeOutCirc: (x: number) => number;
    easeInOutCirc: (x: number) => number;
    easeInBack: (x: number) => number;
    easeOutBack: (x: number) => number;
    easeInOutBack: (x: number) => number;
    easeInElastic: (x: number) => number;
    easeOutElastic: (x: number) => number;
    easeInOutElastic: (x: number) => number;
    easeOutBounce: (x: number) => number;
    easeInBounce: (x: number) => number;
    easeInOutBounce: (x: number) => number;
    linear: (x: number) => number;
};

type CursorPosition = {
    x: number;
    y: number;
};
type CursorOffset = Pick<CursorPosition, 'x' | 'y'>;
type CursorMoveHandler = (position: CursorPosition, modifiers: KeyboardModifierKeysState, ev: MouseEvent) => void;
type CursorEaseProps = {
    /**
     * Продолжительность движения в миллисекундах.
     */
    durationMs: number;
    /**
     * Функция сглаживания движения (linear - по-умолчанию).
     */
    easing?: EasingFunction;
};
interface ICursor {
    /**
     * Подвинуть курсор на позицию {position}.
     *
     * @param position новая позиция
     */
    moveTo(position: Partial<CursorPosition>): void;
    /**
     * Подвинуть курсор относительно текущей позиции.
     *
     * @param offset сдвиг, относительно которого необходимо переместить курсор.
     */
    move(offset: Partial<CursorOffset>): void;
    /**
     * Плавно подвинуть курсор на позицию {props.position}.
     *
     * @param props.position новая позиция
     * @param props.durationMs продолжительность движения в миллисекундах.
     * @param props.easing функция сглаживания движения (linear - по-умолчанию).
     */
    moveToEase(props: {
        position: Partial<CursorPosition>;
    } & CursorEaseProps): Promise<void>;
    /**
     * Плавно подвинуть курсор относительно текущей позиции.
     *
     * @param props.offset сдвиг, относительно которого необходимо переместить курсор.
     * @param props.durationMs продолжительность движения в миллисекундах.
     * @param props.easing функция сглаживания движения (linear - по-умолчанию).
     */
    moveEase(props: {
        offset: Partial<CursorOffset>;
    } & CursorEaseProps): Promise<void>;
    onMove(handler: CursorMoveHandler): Listener;
    getPosition(): CursorPosition;
}
declare const Cursor: ICursor;

type WithDoc = {
    doc: AnyDoc;
};
type AnyDoc = string | string[] | WithDoc | WithDoc[];
declare const DocUtils: {
    holdKey: ({ when, then }: KeyByKeyProps<IPhysicalKey, IPhysicalKey>) => string;
    tapKey: ({ when, then }: KeyByKeyProps<IPhysicalKey, IKey>) => string;
    tickKey: ({ when, then }: KeyByKeyProps<IPhysicalKey, IKey>) => string;
    toStringArray: (docs: AnyDoc) => string[];
    join: (docs: AnyDoc) => string;
    print: (docs: AnyDoc) => void;
    activate: (key: IKey) => string;
    tap: (key: IKey) => string;
    tick: (key: IKey) => string;
    hold: (key: IKey) => string;
    isWithDoc: (docs: AnyDoc) => boolean;
};

/**
 * Скрипт с документацией в паре.
 */
type ScriptWithDoc<T = Listener> = {
    (): T;
} & WithDoc;
type WrapToDocNamedProps<F extends (...args: Parameters<F>) => ReturnType<F>> = {
    getDoc: (...args: Parameters<F>) => AnyDoc;
};
declare const wrapToScriptWithDoc: <F extends (...args: Parameters<F>) => ReturnType<F>>(foo: F, { getDoc }: WrapToDocNamedProps<F>) => ((...args: Parameters<F>) => ScriptWithDoc<ReturnType<F>>);
/**
 * Объединяет несколько скриптов в один скрипт.
 */
declare const combineScriptsWithDoc: (scripts: ScriptWithDoc<void | (() => void) | Listener>[]) => (() => Listener) & {
    doc: string[];
};
/**
 * Запускает скрипты с печатью документации.
 */
declare const runScripts: (scripts: ScriptWithDoc<any>[]) => void;
/**
 * Запускает скрипт с печатью документации.
 */
declare const runScript: (script: ScriptWithDoc<any>) => void;

export { type AnyDoc, BoolState, BoolStateCompose, Cast, Cursor, DisposeWrapper, type Disposer, DocUtils, type EasingFunction, EasingFunctions, type Handler, type IBoolState, type ICast, type ICursor, type IDisposable, type IDisposeWrapper, type IKey, type IKeyboardKey, type IListenable, type IMouseKey, type IObservable, type IPhysicalKey, type IQueue, type IRx, type IStream, Key, type KeyByKeyProps, type Listener as KeyListener, KeysSequence, type Listener$1 as Listener, MouseKey, Observable, PromiseUtils, Queue, Rx, type RxOptions, type ScriptWithDoc, ScrollDirection, ScrollKey, StringUtils, SuchKey, SuchMouseKey, type Timer, type TimerProps, type WhenKeyProps, type WhileAsyncProps, type WhilePredicateProps, type WithDoc, combineDisposers, combineListeners, combineScriptsWithDoc, createTimer, createTimerSequence, force, getHoldKey, getTapKey, getTickByHold, getTickKey, holdKey, inOfAny, runScript, runScripts, stream, tapKey, tickKey, toDisposer, toListener, toggleStateByTap, whileNeed, whileNeedAsync, wrapToScriptWithDoc };
