import { BoolState, IBoolState } from '../../shared/utils/boolState';
import { IPhysicalKey } from '../wrapper/physicalKey';

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
