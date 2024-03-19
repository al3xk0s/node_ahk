import { IStream, stream } from "./stream";

interface QueueItem<T> {
    value: T;
    next?: QueueItem<T>;
}

export interface IQueue<T> {
    pop() : T | undefined;
    popAll() : Iterable<T>;

    push(value: T) : void;

    get canPop() : boolean;
    get length() : number;
    get isEmpty() : boolean;

    toArray() : Iterable<T>;
    stream() : IStream<T>;
}

export class Queue<T> implements IQueue<T> {
    static from<T>(values: Iterable<T>) : IQueue<T> {
        const instance = new Queue<T>();

        for(const v of values) {
            instance.push(v);
        }

        return instance;
    }

    pop(): T | undefined {
        if(this.isEmpty) return;

        const current = this._head;
        this._head = current?.next;

        if(this._head == null) this._tail = undefined;

        return current?.value;
    }

    *popAll(): Iterable<T> {
        let element : T | undefined = undefined;

        while(true) {
            element = this.pop();
            if(element == null) return;
            yield element;
        }
    }

    push(value: T): void {
        const newTail = { value }

        if(this.isEmpty) {
            this._tail = newTail;
            this._head = this._tail;
            return;
        }

        this._tail!.next = newTail;
        this._tail = newTail;
    }

    get isEmpty() { return this._head == null || this._tail == null; }
    get canPop() { return !this.isEmpty; }

    get length(): number {
        if(this.isEmpty) return 0;
        return stream(this.toArray()).count;
    }

    private _head?: QueueItem<T>;
    private _tail?: QueueItem<T>;

    *toArray() {
        let current = this._head;

        while (current != null) {
            yield current.value;
            current = current.next;
        }
    }

    stream(): IStream<T> {
        return stream(this.toArray());
    }
}