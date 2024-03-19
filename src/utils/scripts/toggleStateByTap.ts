import { BoolState, IBoolState } from '@node-ahk/shared/rx';
import { IPhysicalKey } from '@node-ahk/keys';

type ToggleStateByTapProps = {
    initial?: boolean;
    key: IPhysicalKey;
};

export const toggleStateByTap = ({
    initial = false,
    key,
}: ToggleStateByTapProps) : IBoolState => {
    const state = BoolState(initial);
    key.onDown(() => state.toggle());    
    return state;
}
