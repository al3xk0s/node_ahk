import { Keyboard, Mouse, Key, MouseButton } from "suchibot";
import { BoolState, BoolStateCompose } from "../../shared/utils/boolState";
import { Rx } from "../../shared/utils/rx";
import { toggleStateByTap } from "../../utils/keyboard/toggleStateByTap";
import { WhileAsyncProps } from "../../utils/keyboard/whileNeed";
import { IButton } from "../../utils/wrapper/button";
import { IPhysicalButton, ToggleEnabledHandler } from "../../utils/wrapper/physicalButton";
import { ScrollDirection, ScrollDownAsButton, ScrollUpAsButton } from "../../utils/wrapper/scrollAsButton";

type ScrollScriptsProps = {
    scrollUpToggle: IPhysicalButton;
    scrollDownToggle: IPhysicalButton;
    triggerButton: IPhysicalButton;
    scrollStep?: number;   
} & WhileAsyncProps;

export const scrollScripts = ({
    scrollDownToggle,
    scrollUpToggle,
    triggerButton: button,
    delayMs = 50,
    scrollStep = 50,
}: ScrollScriptsProps) => {
    const scrollUp = ScrollUpAsButton(scrollStep);
    const scrollDown = ScrollDownAsButton(scrollStep);
    const state = toggleStateByTap({key: button});

    state.listen(() => console.log(`${state.isEnabled}`))

    const currentButton = Rx(scrollUp, {forceUpdate: true});

    const handler = () => currentButton.value.tick({needContinue: () => state.isEnabled, delayMs});

    scrollDownToggle.onDown(() => currentButton.setValue(scrollDown));
    scrollUpToggle.onDown(() => currentButton.setValue(scrollUp));

    button.onDown(handler);
}
