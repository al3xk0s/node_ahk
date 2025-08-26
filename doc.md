# Документация по типам и скриптам

Этот документ описывает основные типы и скрипты, доступные в библиотеке, с акцентом на взаимодействие с клавиатурой, мышью, скроллом и комбинациями клавиш, а также на работу с таймерами.

## Клавиши и их методы

### Клавиатурные клавиши

Объект `Key` предоставляет доступ ко всем стандартным клавиатурным клавишам. Каждая клавиша является экземпляром `IKeyboardKey`, который расширяет `IPhysicalKey`.

**Основные методы `IPhysicalKey` (применимо к клавиатурным и мышиным клавишам):**

*   `hold(): void`: Зажимает клавишу.
*   `release(): void`: Отпускает клавишу.
*   `onHold(handler: ToggleHandler, options?: Pick<ToggleOptions, 'onDisable'>): Listener`: Событие зажатия и отпускания кнопки.
    *   `handler`: вызывается в случае зажатия кнопки.
    *   `options.onDisable`: вызывается в случае отпускания кнопки.
*   `isDown(): boolean`: Возвращает `true`, если клавиша зажата.
*   `isUp(): boolean`: Возвращает `true`, если клавиша отпущена.
*   `onDown(handler: Handler): Listener`: Регистрирует обработчик, который вызывается при нажатии клавиши.
*   `onUp(handler: Handler): Listener`: Регистрирует обработчик, который вызывается при отпускании клавиши.
*   `tick(props?: TickProps): void`: Начинает периодические нажатия клавиши.
*   `releaseTick(): void`: Прекращает периодические нажатия.
*   `isTicked(): boolean`: Возвращает `true`, если клавиша находится в режиме периодических нажатий.
*   `onTickStart(handler: SimpleHandler): void`: Регистрирует обработчик, который вызывается при начале периодических нажатий.
*   `onTickRelease(handler: SimpleHandler): void`: Регистрирует обработчик, который вызывается при прекращении периодических нажатий.
*   `tap(): void`: Нажимает и сразу отпускает клавишу.
*   `holdOnTime(holdTime: number): Promise<void>`: Зажимает кнопку на заданное время в миллисекундах.
*   `onToggleEnabled(handler: ToggleHandler, options?: ToggleOptions): Listener`: Событие поочередного переключения кнопки из состояний активной / неактивной (1 нажатие - 1 переключение).
    *   `handler`: вызывается в случае переключения в `активное` состояние.
    *   `options.initialEnabled`: позволяет задать начальное состояние.
    *   `options.onDisable`: вызывается в случае переключения в `неактивное` состояние.

### Клавиши мыши

Объект `MouseKey` предоставляет доступ к кнопкам мыши. Каждая кнопка является экземпляром `IMouseKey`, который расширяет `IPhysicalKey`.

**Дополнительные методы `IMouseKey`:**

*   `onClick(handler: (event: MouseEvent) => void): Listener`: Регистрирует обработчик, который вызывается при клике кнопкой мыши.
*   `doubleClick(): void`: Выполняет двойной клик кнопкой мыши.

### Клавиши скролла

Объект `ScrollKey` позволяет создавать клавиши для прокрутки.

*   `ScrollKey.UP(step?: number): IScrollAsKey`: Создает клавишу для прокрутки вверх. `step` определяет величину прокрутки.
*   `ScrollKey.DOWN(step?: number): IScrollAsKey`: Создает клавишу для прокрутки вниз. `step` определяет величину прокрутки.

Каждая клавиша скролла является экземпляром `IScrollAsKey`, который расширяет `IKey`.

### Комбинации клавиш

Функция `KeysSequence` позволяет создавать последовательности физических клавиш.

*   `KeysSequence<T extends SuchKey | SuchMouseKey = SuchKey | SuchMouseKey>(keys: IPhysicalKey<T>[]): IPhysicalKeySequence<T>`: Принимает массив `IPhysicalKey` и возвращает `IPhysicalKeySequence`, который также является `IPhysicalKey` и поддерживает все его методы.

### Курсор

Объект `Cursor` предоставляет методы для управления положением курсора.

*   `moveTo(position: Partial<CursorPosition>): void`: Перемещает курсор в указанную позицию.
*   `move(offset: Partial<CursorOffset>): void`: Перемещает курсор относительно текущей позиции.
*   `onMove(handler: CursorMoveHandler): Listener`: Регистрирует обработчик, который вызывается при перемещении курсора.
*   `getPosition(): CursorPosition`: Возвращает текущую позицию курсора.

## Скрипты и их документация

Библиотека предоставляет набор готовых скриптов для автоматизации действий, а также утилиты для создания и управления скриптами с документацией.

### Основные скрипты

*   `holdKey({ when, then }: KeyByKeyProps<IPhysicalKey, IPhysicalKey>): Listener`:
    *   `when`: переключает состояние скрипта (активное / неактивное).
    *   `then`: при активном состоянии будет зажата.
*   `getHoldKey(args_0: KeyByKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>, IPhysicalKey<SuchKey | SuchMouseKey>>): ScriptWithDoc<Listener>`: Версия `holdKey` со встроенной документацией.

*   `tapKey({ when, then }: KeyByKeyProps<IPhysicalKey, IKey>): Listener`:
    *   `when`: по нажатию на эту клавишу.
    *   `then`: происходит нажатие этой клавиши.
*   `getTapKey(args_0: KeyByKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>, IKey>): ScriptWithDoc<Listener>`: Версия `tapKey` с документацией.

*   `tickKey({ when, then, delayMs, }: TickKeyProps): Listener`:
    *   `when`: переключает состояние скрипта (активное / неактивное).
    *   `then`: при активном состоянии скрипта с определенной периодичностью совершаются нажатия.
    *   `delayMs`: задержка между тиками.
*   `getTickKey(args_0: TickKeyProps): ScriptWithDoc<Listener>`: Версия `tickKey` с документацией.

*   `getTickByHold(args_0: { then: IKey; } & WhenKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>> & { activate: IPhysicalKey; }): ScriptWithDoc<Listener>`:
    *   `activate`: переключает состояние между активным / неактивным.
    *   `when`: в случае активного состояния, при зажатии клавиши происходит многократное нажатие `then`.
    *   Возвращает функцию с документацией.

*   `toggleStateByTap({ initial, key, }: ToggleStateByTapProps): IBoolState`: Скриптовый вариант `IPhysicalKey.onToggleEnabled`. Возвращает стейт, хранящий состояние кнопки (активное / неактивное).

*   `whileNeed({ needContinue, execute, delayMs, }: WhileNeedProps): Promise<void>`: Выполнение определенного действия, пока выполняется условие.
    *   `needContinue`: функция, вызывающаяся каждую итерацию цикла.
    *   `execute`: выполняемое действие.
    *   `delayMs`: задержка после выполнения действия.

*   `whileNeedAsync({ needContinue, execute, delayMs, }: WhileNeedAsyncProps): Promise<void>`: Выполнение асинхронного действия, пока выполняется условие. Является аналогом `whileNeed`.

### Утилиты для скриптов с документацией

*   `ScriptWithDoc<T = Listener>`: Тип, представляющий скрипт с прикрепленной документацией.
*   `wrapToScriptWithDoc<F extends (...args: Parameters<F>) => ReturnType<F>>(foo: F, { getDoc }: WrapToDocNamedProps<F>): ((...args: Parameters<F>) => ScriptWithDoc<ReturnType<F>>)`: Оборачивает функцию в скрипт с документацией.
*   `combineScriptsWithDoc(scripts: ScriptWithDoc<void | (() => void) | Listener>[]): (() => Listener) & { doc: string[]; }`: Объединяет несколько скриптов в один скрипт с общей документацией.
*   `runScripts(scripts: ScriptWithDoc<any>[]): void`: Запускает массив скриптов с печатью документации.
*   `runScript(script: ScriptWithDoc<any>): void`: Запускает один скрипт с печатью документации.

## Таймеры

Библиотека предоставляет функциональность для создания и управления таймерами.

*   `createTimer({ durationMs, onStart, onStop }: TimerProps): { start: () => Promise<void>; stop: () => void; }`: Создает таймер.
    *   `durationMs`: продолжительность таймера в миллисекундах.
    *   `onStart`: необязательный обработчик, вызываемый при запуске таймера.
    *   `onStop`: необязательный обработчик, вызываемый при остановке таймера.
    *   Возвращает объект с методами `start()` для запуска и `stop()` для остановки таймера.
*   `Timer`: Тип, представляющий возвращаемое значение функции `createTimer`.
*   `createTimerSequence({ onStart, onStop }: Omit<TimerProps, "durationMs">, ...timers: Timer[]): Timer`: Создает последовательность таймеров, которые будут выполняться один за другим.