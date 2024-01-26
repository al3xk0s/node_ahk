import { sleep } from 'suchibot';

export type ContinuePredicate = (count: number) => boolean;
export type WhileAsyncProps = { delayMs?: number; }
export type WhilePredicateProps = { needContinue: ContinuePredicate; }

type BasicWhileNeedProps = {
    execute: () => any;
} & WhilePredicateProps;

type WhileNeedProps = BasicWhileNeedProps & WhileAsyncProps;
type WhileNeedSyncProps = BasicWhileNeedProps;

const _delay = 100;

export const whileNeed = async ({
    needContinue,
    execute,
    delayMs = _delay,
}: WhileNeedProps) => {
    let i = 1;

    while(needContinue(i)) {
        execute();
        await sleep(delayMs);
        i++;
    }
}
