import { sleep } from '@node-ahk/utils';

export type ContinuePredicate = (count: number) => boolean;
export type WhileAsyncProps = { delayMs?: number; }
export type WhilePredicateProps = { needContinue: ContinuePredicate; }

type BasicWhileNeedProps = {
    execute: () => any;
} & WhilePredicateProps;

type WhileNeedProps = BasicWhileNeedProps & WhileAsyncProps;

const _delay = 100;

/**
 * Выполнение определенного действия, пока выполняется условие.
 * 
 * @param needContinue функция, вызывающаяся каждую итерацию цикла.
 * @param execute выполняемое действие.
 * @param delayMs задержка после выполнения действия.
 */
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

type WhileNeedAsyncProps = {
    execute: () => Promise<any>;
} & BasicWhileNeedProps & WhileAsyncProps;

/**
 * Выполнение асинхронного действия, пока выполняется условие.
 * 
 * Является аналогом {@link whileNeed}.
 */
export const whileNeedAsync = async ({
    needContinue,
    execute,
    delayMs = _delay,
}: WhileNeedAsyncProps) => {
    let i = 1;

    while(needContinue(i)) {
        await execute();
        await sleep(delayMs);
        i++;
    }
}
