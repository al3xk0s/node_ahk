import { Key as Key$1, MouseButton, KeyboardModifierKeysState, MouseEvent } from 'suchibot';

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
}

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

declare const holdKey: ({ when, then }: KeyByKeyProps<IPhysicalKey, IPhysicalKey>) => Listener;
declare const getHoldKey: (args_0: KeyByKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>, IPhysicalKey<SuchKey | SuchMouseKey>>) => ScriptWithDoc<Listener>;

declare const tapKey: ({ when, then }: KeyByKeyProps<IPhysicalKey, IKey>) => Listener;
declare const getTapKey: (args_0: KeyByKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>, IKey>) => ScriptWithDoc<Listener>;

type TickKeyProps = {
    delayMs?: number;
} & KeyByKeyProps<IPhysicalKey, IKey>;
declare const tickKey: ({ when, then, delayMs, }: TickKeyProps) => Listener;
declare const getTickKey: (args_0: TickKeyProps) => ScriptWithDoc<Listener>;
declare const getTickByHold: (args_0: {
    then: IKey;
} & WhenKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>> & {
    activate: IPhysicalKey;
}) => ScriptWithDoc<Listener>;

type ToggleStateByTapProps = {
    initial?: boolean;
    key: IPhysicalKey;
};
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
declare const whileNeed: ({ needContinue, execute, delayMs, }: WhileNeedProps) => Promise<void>;
type WhileNeedAsyncProps = {
    execute: () => Promise<any>;
} & BasicWhileNeedProps & WhileAsyncProps;
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
type ToggleEnabledOptions = {
    initialEnabled?: boolean;
    onDisable?: ToggleEnabledHandler;
};
type ToggleEnabledHandler = (state: IBoolState, modifiers: KeyboardModifierKeysState) => void;
interface IPhysicalKeyExt {
    onToggleEnabled(handler: ToggleEnabledHandler, options?: ToggleEnabledOptions): Listener;
    onHold(handler: ToggleEnabledHandler, onDisable?: ToggleEnabledOptions['onDisable']): Listener;
    holdTimed(holdTime: number): Promise<void>;
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
declare const ScrollKey: {
    UP: (step?: number) => IScrollAsKey;
    DOWN: (step?: number) => IScrollAsKey;
};

type WithDoc = {
    doc: AnyDoc;
};
type AnyDoc = string | string[] | WithDoc | WithDoc[];
declare const doc: {
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

type ScriptWithDoc<T = Listener> = {
    (): T;
} & WithDoc;
type WrapToDocNamedProps<F extends (...args: Parameters<F>) => ReturnType<F>> = {
    getDoc: (...args: Parameters<F>) => AnyDoc;
};
declare const wrapToScriptWithDoc: <F extends (...args: Parameters<F>) => ReturnType<F>>(foo: F, { getDoc }: WrapToDocNamedProps<F>) => ((...args: Parameters<F>) => ScriptWithDoc<ReturnType<F>>);
declare const combineScriptsWithDoc: (scripts: ScriptWithDoc<void | (() => void) | Listener>[]) => (() => Listener) & {
    doc: string[];
};
declare const runScripts: (scripts: ScriptWithDoc<any>[]) => void;

export { type AnyDoc, BoolState, BoolStateCompose, Cast, DisposeWrapper, type Disposer, type Handler, type IBoolState, type ICast, type IDisposable, type IDisposeWrapper, type IKey, type IKeyboardKey, type IListenable, type IMouseKey, type IObservable, type IPhysicalKey, type IQueue, type IRx, type IStream, Key, type KeyByKeyProps, type Listener as KeyListener, type Listener$1 as Listener, MouseKey, Observable, PromiseUtils, Queue, Rx, type RxOptions, type ScriptWithDoc, ScrollDirection, ScrollKey, StringUtils, SuchKey, SuchMouseKey, type WhenKeyProps, type WhileAsyncProps, type WhilePredicateProps, type WithDoc, combineDisposers, combineListeners, combineScriptsWithDoc, doc, force, getHoldKey, getTapKey, getTickByHold, getTickKey, holdKey, inOfAny, runScripts, stream, tapKey, tickKey, toDisposer, toListener, toggleStateByTap, whileNeed, whileNeedAsync, wrapToScriptWithDoc };
