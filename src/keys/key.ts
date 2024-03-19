import { KeyboardModifierKeysState } from 'suchibot';
import { WhileAsyncProps, whileNeed, WhilePredicateProps } from '@node-ahk/utils/scripts';

export type Listener = { stop: () => any }
export type Handler = (modifiers: KeyboardModifierKeysState) => void;

type AsyncTickProps = WhileAsyncProps;
type BasicTickProps = WhilePredicateProps;
type BasicTickTimesProps = {  times: number; }

type TickProps = BasicTickProps & AsyncTickProps;
type TickTimesProps = BasicTickTimesProps & AsyncTickProps;

interface IKeyExtentions {
    tick(props: TickProps) : Promise<void>;
    tickTimes(props: TickTimesProps) : Promise<void>;
}

export interface IKey extends IKeyExtentions {
    tap() : void;
    toString() : string;
}

export const _commonKeyExt = (tap: () => void) : IKeyExtentions => {
    const getTimesPredicate = (times: number) => (c: number) => c < times + 1;

    const tick = async (props: TickProps) => whileNeed({...props, execute: tap});

    const tickTimes = ({times, delayMs}: TickTimesProps) =>
        tick({needContinue: getTimesPredicate(times), delayMs});

    return {
        tick,
        tickTimes,
    }
}
