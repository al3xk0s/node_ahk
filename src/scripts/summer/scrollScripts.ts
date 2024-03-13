import { Rx } from "../../shared/utils/rx";
import { toggleStateByTap } from "../../utils/keyboard/toggleStateByTap";
import { WhileAsyncProps } from "../../utils/keyboard/whileNeed";
import { IPhysicalButton } from "../../utils/wrapper/physicalButton";
import { ScrollDownAsButton, ScrollUpAsButton } from "../../utils/wrapper/scrollAsButton";
import { doc } from "../../utils/keyboard/doc";
import { wrapToScriptWithDoc } from "../../utils/keyboard/scriptWithDoc";

type ScrollScriptsProps = {
    scrollUpToggle: IPhysicalButton;
    scrollDownToggle: IPhysicalButton;
    triggerButton: IPhysicalButton;
    scrollStep?: number;   
} & WhileAsyncProps;

const scrollScript = ({
    scrollDownToggle,
    scrollUpToggle,
    triggerButton: button,
    delayMs = 50,
    scrollStep = 50,
}: ScrollScriptsProps) => {
    const scrollUp = ScrollUpAsButton(scrollStep);
    const scrollDown = ScrollDownAsButton(scrollStep);
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

// export const getScrollScripts = ({
//     scrollDownToggle,
//     scrollUpToggle,
//     triggerButton: button,
//     delayMs = 50,
//     scrollStep = 50,
// }: ScrollScriptsProps) : ScriptWithDoc => {
//     const call = () => {
//         const scrollUp = ScrollUpAsButton(scrollStep);
//         const scrollDown = ScrollDownAsButton(scrollStep);
//         const state = toggleStateByTap({ key: button });

//         state.listen(() => console.log(`Scroll: ${state.isEnabled}`))

//         const currentButton = Rx(scrollUp, { forceUpdate: true });

//         const handler = () => currentButton.value.tick({ needContinue: () => state.isEnabled, delayMs });

//         scrollDownToggle.onDown(() => currentButton.setValue(scrollDown));
//         scrollUpToggle.onDown(() => currentButton.setValue(scrollUp));

//         return button.onDown(handler);
//     }

//     return Object.assign(
//         call, {
//         doc: [
//             `${doc.activate(scrollUpToggle).toTitleCase()} to up direction`,
//             `or ${scrollDownToggle.toString()} to down direction,`,
//             `and ${doc.activate(button)} to start scroll tick`
//         ].join(' ')
//     })
// }
