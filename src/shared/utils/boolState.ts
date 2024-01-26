import { DisposeWrapper, IDisposeWrapper, Observable } from "./observable";
import { IRx, Rx, RxOptions } from "./rx";

export interface IBoolState extends IRx<boolean> {
    toggle() : void;
    enable() : void;
    disable() : void;

    get isEnabled() : boolean;
}

export const BoolState = (initial: boolean = false, options: RxOptions<boolean> = {}) : IBoolState => {
    let state = Rx(initial, options);

    const toggle = () => state.setValue(!state.value);
    const enable = () => state.setValue(true);
    const disable = () => state.setValue(false);

    return {        
        get value() { return state.value; },
        get isEnabled() { return state.value; },
        setValue: state.setValue,
        dispose: state.dispose,
        listen: state.listen,
        toggle,
        enable,
        disable,
    }
}

export const BoolStateCompose = {
    onlyOneActive: (...states: IBoolState[]) : IDisposeWrapper => {
        const disposeWrapper = DisposeWrapper();

        for(let i = 0; i < states.length; i++) {
            const current = states[i];
            const other : IBoolState[] = [];

            for(let j = 0; j < states.length; j++) {
                if(i != j) other.push(states[j]);
            }

            disposeWrapper.addDisposer(
                current.listen(newValue => newValue && other.forEach(s => s.disable()))
            );
            
        }

        return disposeWrapper;
    }
};
