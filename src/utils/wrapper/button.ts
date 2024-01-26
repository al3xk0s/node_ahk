import { KeyboardModifierKeysState } from 'suchibot';
import { WhileAsyncProps, whileNeed, WhilePredicateProps } from '../keyboard/whileNeed';

export type Listener = { stop: () => any }
export type Handler = (modifiers: KeyboardModifierKeysState) => void;

type AsyncTickProps = WhileAsyncProps;
type BasicTickProps = WhilePredicateProps;
type BasicTickTimesProps = {  times: number; }

type TickProps = BasicTickProps & AsyncTickProps;
type TickTimesProps = BasicTickTimesProps & AsyncTickProps;

type TickSyncProps = BasicTickProps;
type TickTimesSyncProps = BasicTickProps & BasicTickTimesProps;

interface IButtonExtentions {
    tick(props: TickProps) : Promise<void>;
    tickTimes(props: TickTimesProps) : Promise<void>;
}

export interface IButton extends IButtonExtentions {
    tap() : void;    
}

export const _commonButtonExt = (tap: () => void) : IButtonExtentions => {
    const getTimesPredicate = (times: number) => (c: number) => c < times + 1;

    const tick = async (props: TickProps) => whileNeed({...props, execute: tap});

    const tickTimes = ({times, delayMs}: TickTimesProps) =>
        tick({needContinue: getTimesPredicate(times), delayMs});

    return {
        tick,
        tickTimes,
    }
}
