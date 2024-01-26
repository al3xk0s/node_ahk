import { Mouse } from 'suchibot';
import { Observable } from '../../shared/utils/observable';
import { IButton, _commonButtonExt } from "./button";

export enum ScrollDirection {
    up = 1,
    down = -1,
}

export interface IScrollAsButton extends IButton {
    readonly step: number;
    readonly direction: ScrollDirection;
}

type ScrollAsButtonProps = {
    direction: ScrollDirection,
    step?: number,
}

const _defaultStep = 100;

export const ScrollAsButton = ({step = _defaultStep, direction}: ScrollAsButtonProps) : IScrollAsButton => {
    const obs = Observable<void>();
    const tap = () => {
        Mouse.scroll({y: step * direction});
        obs.notify();
    };

    return {
        step,
        direction,
        tap,
        ..._commonButtonExt(tap),        
    }
}

export const ScrollDownAsButton = (step = _defaultStep) => {
    return ScrollAsButton({step, direction: ScrollDirection.down});
}

export const ScrollUpAsButton = (step = _defaultStep) => {
    return ScrollAsButton({step, direction: ScrollDirection.up});
}
