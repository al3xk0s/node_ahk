import { doc, wrapToScriptWithDoc } from "@node-ahk/docScript";
import { IPhysicalKey, ScrollKey } from "@node-ahk/keys";
import { Rx } from "@node-ahk/shared/rx";
import { WhileAsyncProps, toggleStateByTap } from "@node-ahk/utils/scripts";

type ScrollScriptsProps = {
    scrollUpToggle: IPhysicalKey;
    scrollDownToggle: IPhysicalKey;
    triggerButton: IPhysicalKey;
    scrollStep?: number;   
} & WhileAsyncProps;

const scrollScript = ({
    scrollDownToggle,
    scrollUpToggle,
    triggerButton: button,
    delayMs = 50,
    scrollStep = 50,
}: ScrollScriptsProps) => {
    const scrollUp = ScrollKey.UP(scrollStep);
    const scrollDown = ScrollKey.DOWN(scrollStep);
    const state = toggleStateByTap({ key: button });

    state.listen(() => console.log(`Scroll: ${state.isEnabled}`))

    const currentButton = Rx(scrollUp, { forceUpdate: true });

    const handler = () => currentButton.value.tick({ needContinue: () => state.isEnabled, delayMs });

    scrollDownToggle.onDown(() => currentButton.setValue(scrollDown));
    scrollUpToggle.onDown(() => currentButton.setValue(scrollUp));

    return button.onDown(handler);
}

export const getScrollScripts = wrapToScriptWithDoc(
    scrollScript, {
    getDoc: ({scrollUpToggle, scrollDownToggle, triggerButton}) => [
        `${doc.activate(scrollUpToggle).toTitleCase()} to up direction`,
        `or ${scrollDownToggle.toString()} to down direction,`,
        `and ${doc.activate(triggerButton)} to start scroll tick`
    ].join(' ')
})
