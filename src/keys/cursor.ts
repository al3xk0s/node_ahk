import { KeyboardModifierKeysState, Mouse, MouseEvent, sleep } from "suchibot";
import { Listener } from "./key";
import { EasingFunction, EasingFunctions } from "@node-ahk/utils/easing";

export type CursorPosition = { x: number; y: number };
export type CursorOffset = Pick<CursorPosition, 'x' | 'y'>;
export type CursorMoveHandler = (position: CursorPosition, modifiers: KeyboardModifierKeysState, ev: MouseEvent) => void;

export type CursorEaseProps = {
    /**
     * Продолжительность движения в миллисекундах.
     */
    durationMs: number;

    /**
     * Функция сглаживания движения (linear - по-умолчанию).
     */
    easing?: EasingFunction;
};

export interface ICursor {
    /**
     * Подвинуть курсор на позицию {position}.
     * 
     * @param position новая позиция
     */
    moveTo(position: Partial<CursorPosition>) : void;

    /**
     * Подвинуть курсор относительно текущей позиции.
     * 
     * @param offset сдвиг, относительно которого необходимо переместить курсор.
     */
    move(offset: Partial<CursorOffset>) : void;

    /**
     * Плавно подвинуть курсор на позицию {props.position}.
     * 
     * @param props.position новая позиция
     * @param props.durationMs продолжительность движения в миллисекундах.
     * @param props.easing функция сглаживания движения (linear - по-умолчанию).
     */
    moveToEase(props: { position: Partial<CursorPosition> } & CursorEaseProps) : Promise<void>;

    /**
     * Плавно подвинуть курсор относительно текущей позиции.
     * 
     * @param props.offset сдвиг, относительно которого необходимо переместить курсор.
     * @param props.durationMs продолжительность движения в миллисекундах.
     * @param props.easing функция сглаживания движения (linear - по-умолчанию).
     */
    moveEase(props: { offset: Partial<CursorOffset> } & CursorEaseProps) : Promise<void>;

    onMove(handler: CursorMoveHandler) : Listener;
    getPosition() : CursorPosition;
}

export const Cursor = (() : ICursor => {
    const getPosition = () => Mouse.getPosition() as CursorPosition;

    const moveTo = ({x, y}: Partial<CursorPosition>) => {
        if(x != null && y != null) return Mouse.moveTo(x, y);

        const current = getPosition();

        return Mouse.moveTo(x ?? current.x, y ?? current.y);
    }


    const move = ({x, y}: Partial<CursorOffset>) => {
        const current = getPosition();

        return moveTo({x: current.x + (x ?? 0), y: current.y + (y ?? 0)});
    }

    const moveEase : ICursor['moveEase'] = ({offset, durationMs, easing = EasingFunctions.linear}) => {
        return new Promise<void>(async (res) => {
            const startPosition = getPosition();
            const endPosition = { x: startPosition.x + (offset.x ?? 0), y: startPosition.y + (offset.y ?? 0) };

            const diffX = endPosition.x - startPosition.x;
            const diffY = endPosition.y - startPosition.y;

            const startTime = Date.now();
            const intervalMs = 1; // Интервал обновления позиции курсора

            while (true) {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(1, elapsed / durationMs);
                const easedProgress = easing(progress);

                const currentX = startPosition.x + diffX * easedProgress;
                const currentY = startPosition.y + diffY * easedProgress;

                Mouse.moveTo(currentX, currentY);

                if (progress === 1) break;

                await sleep(intervalMs);
            }
            
            res();
        });
    }

    const moveToEase : ICursor['moveToEase'] = ({position, durationMs, easing = EasingFunctions.linear}) => {
        return new Promise<void>(async (res) => {
            const startPosition = getPosition();
            const endPosition = { x: position.x ?? startPosition.x, y: position.y ?? startPosition.y };

            const diffX = endPosition.x - startPosition.x;
            const diffY = endPosition.y - startPosition.y;                        

            const startTime = Date.now();
            const intervalMs = 1; // Интервал обновления позиции курсора

            while (true) {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(1, elapsed / durationMs);
                const easedProgress = easing(progress);

                const currentX = startPosition.x + diffX * easedProgress;
                const currentY = startPosition.y + diffY * easedProgress;

                Mouse.moveTo(currentX, currentY);

                if (progress === 1) break;

                await sleep(intervalMs);
            }
            
            res();
        });
    }

    return {
        move,
        moveTo,
        moveToEase,
        moveEase,
        getPosition,
        onMove: (handler) => Mouse.onMove(
            (ev) => handler({x: ev.x, y: ev.y}, ev.modifierKeys, ev)
        ),
    };
})();
