import { KeyboardModifierKeysState, sleep } from 'suchibot';
import { WhileAsyncProps, WhilePredicateProps } from '@node-ahk/utils/scripts';
import { BoolState } from '@node-ahk/bundle';
import { toListener } from '@node-ahk/utils';

export type Listener = { stop: () => any }
export type Handler = (modifiers: KeyboardModifierKeysState) => void;
type SimpleHandler = () => void;

type AsyncTickProps = WhileAsyncProps;
type BasicTickProps = WhilePredicateProps;
type BasicTickTimesProps = {  times: number; }

type TickProps = AsyncTickProps;
type TickTimesProps = BasicTickTimesProps & AsyncTickProps;

interface IKeyExtentions {
    tick(props?: TickProps) : void;

    onTickStart(handler: SimpleHandler) : void;
    onTickRelease(handler: SimpleHandler) : void;

    releaseTick() : void;
    isTicked() : boolean;
}

export interface IKey extends IKeyExtentions {
    tap() : void;
    toString() : string;
}

export const _commonKeyExt = (tap: () => void) : IKeyExtentions => {
    const tickState = BoolState(false);

    const isTicked = () => tickState.isEnabled;

    const startTick = async (delayMs: number) => {
        while(isTicked()) {
            tap();
            await sleep(delayMs);
        }
    }

    const releaseTick = () => tickState.disable();

    const onTickStart : IKeyExtentions['onTickStart'] = (handler) => {
        const dispose = tickState.listen((isTick) => {
            if(isTick) handler();
        });

        return toListener(dispose);
    }

    const onTickRelease : IKeyExtentions['onTickRelease'] = (handler) => {
        const dispose = tickState.listen((isTick) => {
            if(!isTick) handler();
        });

        return toListener(dispose);
    }

    const tick : IKeyExtentions['tick'] = ({delayMs = 50} = {}) => {
        if(isTicked()) releaseTick();
        tickState.enable();
        startTick(delayMs);
    }

    return {
        tick,
        onTickStart,
        onTickRelease,
        releaseTick,
        isTicked,
    }
}
