import { IKey, IPhysicalKey } from "@node-ahk/keys"

export type WhenKeyProps<B = IPhysicalKey> = {
    when: B;
}

export type KeyByKeyProps<B = IPhysicalKey, T = IKey> = {
    then: T;
} & WhenKeyProps<B>;
