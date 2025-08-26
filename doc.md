# Документация по типам и скриптам

Этот документ описывает основные типы и скрипты, доступные в библиотеке, с акцентом на взаимодействие с клавиатурой, мышью, скроллом и комбинациями клавиш, а также на работу с таймерами.

## Клавиши и их методы

### Клавиатурные клавиши

Объект [`Key`](dist/index.d.ts#310) предоставляет доступ ко всем стандартным клавиатурным клавишам. Каждая клавиша является экземпляром [`IKeyboardKey`](dist/index.d.ts#302), который расширяет [`IPhysicalKey`](dist/index.d.ts#292).

**Основные методы [`IPhysicalKey`](dist/index.d.ts#292) (применимо к клавиатурным и мышиным клавишам):**

*   [`onDown(handler: Handler): Listener`](dist/index.d.ts#L293): Регистрирует обработчик, который вызывается при нажатии клавиши.
*   [`onUp(handler: Handler): Listener`](dist/index.d.ts#294): Регистрирует обработчик, который вызывается при отпускании клавиши.
*   [`isDown(): boolean`](dist/index.d.ts#295): Возвращает `true`, если клавиша зажата.
*   [`isUp(): boolean`](dist/index.d.ts#296): Возвращает `true`, если клавиша отпущена.
*   [`hold(): void`](dist/index.d.ts#297): Зажимает клавишу.
*   [`release(): void`](dist/index.d.ts#298): Отпускает клавишу.
*   [`tap(): void`](dist/index.d.ts#250): Нажимает и сразу отпускает клавишу.
*   [`onToggleEnabled(handler: ToggleHandler, options?: ToggleOptions): Listener`](dist/index.d.ts#277): Событие поочередного переключения кнопки из состояний активной / неактивной (1 нажатие - 1 переключение).
    *   `handler`: вызывается в случае переключения в `активное` состояние.
    *   `options.initialEnabled`: позволяет задать начальное состояние.
    *   `options.onDisable`: вызывается в случае переключения в `неактивное` состояние.
*   [`onHold(handler: ToggleHandler, options?: Pick<ToggleOptions, 'onDisable'>): Listener`](dist/index.d.ts#284): Событие зажатия и отпускания кнопки.
    *   `handler`: вызывается в случае зажатия кнопки.
    *   `options.onDisable`: вызывается в случае отпускания кнопки.
*   [`holdOnTime(holdTime: number): Promise<void>`](dist/index.d.ts#288): Зажимает кнопку на заданное время в миллисекундах.
*   [`tick(props?: TickProps): void`](dist/index.d.ts#243): Начинает периодические нажатия клавиши.
*   [`onTickStart(handler: SimpleHandler): void`](dist/index.d.ts#244): Регистрирует обработчик, который вызывается при начале периодических нажатий.
*   [`onTickRelease(handler: SimpleHandler): void`](dist/index.d.ts#245): Регистрирует обработчик, который вызывается при прекращении периодических нажатий.
*   [`releaseTick(): void`](dist/index.d.ts#246): Прекращает периодические нажатия.
*   [`isTicked(): boolean`](dist/index.d.ts#247): Возвращает `true`, если клавиша находится в режиме периодических нажатий.

### Клавиши мыши

Объект [`MouseKey`](dist/index.d.ts#435) предоставляет доступ к кнопкам мыши. Каждая кнопка является экземпляром [`IMouseKey`](dist/index.d.ts#303), который расширяет [`IPhysicalKey`](dist/index.d.ts#292).

**Дополнительные методы [`IMouseKey`](dist/index.d.ts#303):**

*   [`onClick(handler: (event: MouseEvent) => void): Listener`](dist/index.d.ts#304): Регистрирует обработчик, который вызывается при клике кнопкой мыши.
*   [`doubleClick(): void`](dist/index.d.ts#305): Выполняет двойной клик кнопкой мыши.

### Клавиши скролла

Объект [`ScrollKey`](dist/index.d.ts#444) позволяет создавать клавиши для прокрутки.

*   [`ScrollKey.UP(step?: number): IScrollAsKey`](dist/index.d.ts#445): Создает клавишу для прокрутки вверх. `step` определяет величину прокрутки.
*   [`ScrollKey.DOWN(step?: number): IScrollAsKey`](dist/index.d.ts#446): Создает клавишу для прокрутки вниз. `step` определяет величину прокрутки.

Каждая клавиша скролла является экземпляром [`IScrollAsKey`](dist/index.d.ts#258), который расширяет [`IKey`](dist/index.d.ts#249).

### Комбинации клавиш

Функция [`KeysSequence`](dist/index.d.ts#443) позволяет создавать последовательности физических клавиш.

*   [`KeysSequence<T extends SuchKey | SuchMouseKey = SuchKey | SuchMouseKey>(keys: IPhysicalKey<T>[]): IPhysicalKeySequence<T>`](dist/index.d.ts#443): Принимает массив [`IPhysicalKey`](dist/index.d.ts#292) и возвращает [`IPhysicalKeySequence`](dist/index.d.ts#307), который также является [`IPhysicalKey`](dist/index.d.ts#292) и поддерживает все его методы.

### Курсор

Объект [`Cursor`](dist/index.d.ts#471) предоставляет методы для управления положением курсора.

*   [`moveTo(position: Partial<CursorPosition>): void`](dist/index.d.ts#461): Перемещает курсор в указанную позицию.
*   [`move(offset: Partial<CursorOffset>): void`](dist/index.d.ts#466): Перемещает курсор относительно текущей позиции.
*   [`onMove(handler: CursorMoveHandler): Listener`](dist/index.d.ts#468): Регистрирует обработчик, который вызывается при перемещении курсора.
*   [`getPosition(): CursorPosition`](dist/index.d.ts#469): Возвращает текущую позицию курсора.

## Скрипты и их документация

Библиотека предоставляет набор готовых скриптов для автоматизации действий, а также утилиты для создания и управления скриптами с документацией.

### Основные скрипты

*   [`holdKey({ when, then }: KeyByKeyProps<IPhysicalKey, IPhysicalKey>): Listener`](dist/index.d.ts#149):
    *   `when`: переключает состояние скрипта (активное / неактивное).
    *   `then`: при активном состоянии будет зажата.
*   [`getHoldKey(args_0: KeyByKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>, IPhysicalKey<SuchKey | SuchMouseKey>>): ScriptWithDoc<Listener>`](dist/index.d.ts#155): Версия [`holdKey`](dist/index.d.ts#149) со встроенной документацией.

*   [`tapKey({ when, then }: KeyByKeyProps<IPhysicalKey, IKey>): Listener`](dist/index.d.ts#160):
    *   `when`: по нажатию на эту клавишу.
    *   `then`: происходит нажатие этой клавиши.
*   [`getTapKey(args_0: KeyByKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>, IKey>): ScriptWithDoc<Listener>`](dist/index.d.ts#166): Версия [`tapKey`](dist/index.d.ts#160) с документацией.

*   [`tickKey({ when, then, delayMs, }: TickKeyProps): Listener`](dist/index.d.ts#176):
    *   `when`: переключает состояние скрипта (активное / неактивное).
    *   `then`: при активном состоянии скрипта с определенной периодичностью совершаются нажатия.
    *   `delayMs`: задержка между тиками.
*   [`getTickKey(args_0: TickKeyProps): ScriptWithDoc<Listener>`](dist/index.d.ts#182): Версия [`tickKey`](dist/index.d.ts#176) с документацией.

*   [`getTickByHold(args_0: { then: IKey; } & WhenKeyProps<IPhysicalKey<SuchKey | SuchMouseKey>> & { activate: IPhysicalKey; }): ScriptWithDoc<Listener>`](dist/index.d.ts#189):
    *   `activate`: переключает состояние между активным / неактивным.
    *   `when`: в случае активного состояния, при зажатии клавиши происходит многократное нажатие `then`.
    *   Возвращает функцию с документацией.

*   [`toggleStateByTap({ initial, key, }: ToggleStateByTapProps): IBoolState`](dist/index.d.ts#204): Скриптовый вариант [`IPhysicalKey.onToggleEnabled`](dist/index.d.ts#277). Возвращает стейт, хранящий состояние кнопки (активное / неактивное).

*   [`whileNeed({ needContinue, execute, delayMs, }: WhileNeedProps): Promise<void>`](dist/index.d.ts#224): Выполнение определенного действия, пока выполняется условие.
    *   `needContinue`: функция, вызывающаяся каждую итерацию цикла.
    *   `execute`: выполняемое действие.
    *   `delayMs`: задержка после выполнения действия.

*   [`whileNeedAsync({ needContinue, execute, delayMs, }: WhileNeedAsyncProps): Promise<void>`](dist/index.d.ts#233): Выполнение асинхронного действия, пока выполняется условие. Является аналогом [`whileNeed`](dist/index.d.ts#224).

### Утилиты для скриптов с документацией

*   [`ScriptWithDoc<T = Listener>`](dist/index.d.ts#494): Тип, представляющий скрипт с прикрепленной документацией.
*   [`wrapToScriptWithDoc<F extends (...args: Parameters<F>) => ReturnType<F>>(foo: F, { getDoc }: WrapToDocNamedProps<F>): ((...args: Parameters<F>) => ScriptWithDoc<ReturnType<F>>)`](dist/index.d.ts#500): Оборачивает функцию в скрипт с документацией.
*   [`combineScriptsWithDoc(scripts: ScriptWithDoc<void | (() => void) | Listener>[]): (() => Listener) & { doc: string[]; }`](dist/index.d.ts#504): Объединяет несколько скриптов в один скрипт с общей документацией.
*   [`runScripts(scripts: ScriptWithDoc<any>[]): void`](dist/index.d.ts#510): Запускает массив скриптов с печатью документации.
*   [`runScript(script: ScriptWithDoc<any>): void`](dist/index.d.ts#514): Запускает один скрипт с печатью документации.

## Таймеры

Библиотека предоставляет функциональность для создания и управления таймерами.

*   [`createTimer({ durationMs, onStart, onStop }: TimerProps): { start: () => Promise<void>; stop: () => void; }`](dist/index.d.ts#57): Создает таймер.
    *   `durationMs`: продолжительность таймера в миллисекундах.
    *   `onStart`: необязательный обработчик, вызываемый при запуске таймера.
    *   `onStop`: необязательный обработчик, вызываемый при остановке таймера.
    *   Возвращает объект с методами `start()` для запуска и `stop()` для остановки таймера.
*   [`Timer`](dist/index.d.ts#61): Тип, представляющий возвращаемое значение функции [`createTimer`](dist/index.d.ts#57).
*   [`createTimerSequence({ onStart, onStop }: Omit<TimerProps, "durationMs">, ...timers: Timer[]): Timer`](dist/index.d.ts#62): Создает последовательность таймеров, которые будут выполняться один за другим.