import { IButton, Listener } from "../wrapper/button"
import { IPhysicalButton } from "../wrapper/physicalButton"
import { WithDoc } from "./doc";

export type WhenKeyProps<B = IPhysicalButton> = {
    when: B;
}

export type KeyByKeyProps<B = IPhysicalButton, T = IButton> = {
    then: T;
} & WhenKeyProps<B>;

