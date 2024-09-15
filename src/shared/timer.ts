import { PromiseUtils } from "./promise";

export type TimerProps = {
    durationMs: number;
    onStart?: () => void;
    onStop?: () => void;
}

export const createTimer = ({ durationMs, onStart, onStop }: TimerProps) => {
    let pid : any;

    let res : Function | undefined;
    let promise: Promise<void> | undefined;

    const stop = () => {
        if(pid == null) return;

        clearTimeout(pid);
        pid = null;

        promise = undefined;
        res?.();
    }

    const start = () => {
        stop();
        onStart?.();
        promise = new Promise((resolve) => {
            res = resolve;
        }).then(() => onStop?.());
        
        pid = setTimeout(() => {
            stop();                
        }, durationMs);

        return promise;
    };

    return {
        start,
        stop,
    }
}

export type Timer = ReturnType<typeof createTimer>;

export const createCombinedTimer = ({onStart, onStop}: Omit<TimerProps, 'durationMs'>, ...timers: Timer[]) : Timer => {
    let current : Timer | undefined;
    let isStopped = true;

    const stop = () => {
        if(isStopped) return;

        current?.stop();
        isStopped = true;        
    }

    const _start = async () => {
        stop();
        isStopped = false;
        onStart?.();

        for(const timer of timers) {
            if(isStopped) break;
            current = timer;
            await current.start();
        }

        stop();
    }

    const start = async () => {
        await _start();
        onStop?.();
    }

    return {
        start,
        stop,
    }
}
