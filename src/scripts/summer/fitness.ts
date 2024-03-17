import { PhysicalKeyboardButton } from "../../utils/wrapper/physicalButton";
import { whileNeedAsync } from "../../utils/keyboard/whileNeed";
import '../../extensions/extensions';
import { WhenKeyProps } from "../../utils/keyboard/types";
import { getCommonScripts } from "./commonScripts";
import { doc } from "../../utils/keyboard/doc";
import { execScripts, wrapToScriptWithDoc } from "../../utils/keyboard/scriptWithDoc";
import { Key } from "../../utils/suchibot";

type BurpeeScriptProps = {
    sitDelay?: number;
    jumpDelay?: number;
} & WhenKeyProps;

const burpeeScript = ({when, sitDelay = 400, jumpDelay = 725}: BurpeeScriptProps) => {
    const sitButton = PhysicalKeyboardButton(Key.C);
    const jumpButton = PhysicalKeyboardButton(Key.SPACE);

    const sit = async () => {
        await sitButton.holdTimed(sitDelay);
        return sitButton.holdTimed(sitDelay);
    }

    const jump = () => jumpButton.holdTimed(jumpDelay);

    const doBurpee = async () => {
        await sit();
        return jump();
    }

    return when.onToggleEnabled((state) => {
        whileNeedAsync({ needContinue: () => state.isEnabled, execute: doBurpee });
    })
}

const getBurpeeScript = wrapToScriptWithDoc(
    burpeeScript, {
    getDoc: ({when}) => `When ${doc.activate(when)}, then do burpee`,
});

const main = () => {
    execScripts([
        getCommonScripts(),
        getBurpeeScript({when: PhysicalKeyboardButton(Key.DOWN)}),
    ])
}

main();
