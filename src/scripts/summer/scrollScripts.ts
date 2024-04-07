import { doc, wrapToScriptWithDoc } from "@node-ahk/docScript";
import { IPhysicalKey, ScrollKey } from "@node-ahk/keys";
import { Rx } from "@node-ahk/shared/rx";
import { combineListeners } from "@node-ahk/utils";
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

    const release = () => {
        scrollUp.releaseTick();
        scrollDown.releaseTick();
    }

    const currentButton = Rx(scrollUp, { forceUpdate: true });

    return combineListeners([
        scrollDownToggle.onDown(() => currentButton.setValue(scrollDown)),
        scrollUpToggle.onDown(() => currentButton.setValue(scrollUp)),
        button.onToggleEnabled(() => currentButton.value.tick({ delayMs }), { onDisable: release }),
    ])
}

export const getScrollScripts = wrapToScriptWithDoc(
    scrollScript, {
    getDoc: ({scrollUpToggle, scrollDownToggle, triggerButton}) => [
        `${doc.activate(scrollUpToggle).toTitleCase()} to up direction`,
        `or ${scrollDownToggle.toString()} to down direction,`,
        `and ${doc.activate(triggerButton)} to start scroll tick`
    ].join(' ')
})
