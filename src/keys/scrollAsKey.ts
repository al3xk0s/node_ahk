import { Mouse } from 'suchibot';
import { Observable } from '@node-ahk/shared/rx';
import { IKey, _commonKeyExt } from "./key";

export enum ScrollDirection {
    up = 1,
    down = -1,
}

export interface IScrollAsKey extends IKey {
    readonly step: number;
    readonly direction: ScrollDirection;
}

type ScrollAsKeyProps = {
    direction: ScrollDirection,
    step?: number,
}

const _defaultStep = 100;

export const ScrollAsKey = ({step = _defaultStep, direction}: ScrollAsKeyProps) : IScrollAsKey => {
    const obs = Observable<void>();
    const tap = () => {
        Mouse.scroll({y: step * direction});
        obs.notify();
    };

    return {
        step,
        direction,
        tap,
        ..._commonKeyExt(tap),
        toString: () => `${ScrollDirection[direction]} (scroll)`
    }
}

export const ScrollDownAsKey = (step = _defaultStep) => {
    return ScrollAsKey({step, direction: ScrollDirection.down});
}

export const ScrollUpAsKey = (step = _defaultStep) => {
    return ScrollAsKey({step, direction: ScrollDirection.up});
}
