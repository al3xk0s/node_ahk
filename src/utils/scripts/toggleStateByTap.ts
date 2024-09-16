import { BoolState, IBoolState } from '@node-ahk/shared/rx';
import { IPhysicalKey } from '@node-ahk/keys';

type ToggleStateByTapProps = {
    initial?: boolean;
    key: IPhysicalKey;
};

/**
 * Скриптовый вариант {@link IPhysicalKey.onToggleEnabled}.
 * 
 * @returns стейт, хранящий состояние кнопки (активное / неактивное).
 */
export const toggleStateByTap = ({
    initial = false,
    key,
}: ToggleStateByTapProps) : IBoolState => {
    const state = BoolState(initial);
    key.onDown(() => state.toggle());    
    return state;
}
