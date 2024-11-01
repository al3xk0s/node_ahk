import { KeyboardModifierKeysState, Mouse, MouseEvent } from "suchibot";
import { Listener } from "./key";

export type CursorPosition = { x: number; y: number };
export type CursorOffset = Pick<CursorPosition, 'x' | 'y'>;
export type CursorMoveHandler = (position: CursorPosition, modifiers: KeyboardModifierKeysState, ev: MouseEvent) => void;

export interface ICursor {
    /**
     * Подвинуть курсор на позицию {position}.
     * 
     * @param position 
     */
    moveTo(position: Partial<CursorPosition>) : void;

    /**
     * Подвинуть курсор относительно текущей позиции.
     * 
     * @param offset сдвиг, относительно которого необходимо переместить курсор.
     */
    move(offset: Partial<CursorOffset>) : void;

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

    return {
        move,
        moveTo,
        getPosition,
        onMove: (handler) => Mouse.onMove(
            (ev) => handler({x: ev.x, y: ev.y}, ev.modifierKeys, ev)
        ),
    };
})();
