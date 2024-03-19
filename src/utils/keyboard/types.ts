import { IKey, Listener } from "../wrapper/key"
import { IPhysicalKey } from "../wrapper/physicalKey"
import { WithDoc } from "./doc";

export type WhenKeyProps<B = IPhysicalKey> = {
    when: B;
}

export type KeyByKeyProps<B = IPhysicalKey, T = IKey> = {
    then: T;
} & WhenKeyProps<B>;

