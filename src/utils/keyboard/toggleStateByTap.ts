import { BoolState, IBoolState } from '../../shared/utils/boolState';
import { IPhysicalButton } from '../wrapper/physicalButton';

type ToggleStateByTapProps = {
    initial?: boolean;
    key: IPhysicalButton;
};

export const toggleStateByTap = ({
    initial = false,
    key,
}: ToggleStateByTapProps) : IBoolState => {
    const state = BoolState(initial);
    key.onDown(() => state.toggle());    
    return state;
}
