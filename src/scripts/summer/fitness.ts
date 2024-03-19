import '@node-ahk/extensions/extensions';
import { Key } from '@node-ahk/keys';
import { WhenKeyProps, whileNeedAsync } from '@node-ahk/utils/scripts';
import { doc, execScripts, wrapToScriptWithDoc } from '@node-ahk/docScript';
import { getCommonScripts } from "./commonScripts";

type BurpeeScriptProps = {
    sitDelay?: number;
    jumpDelay?: number;
} & WhenKeyProps;

const burpeeScript = ({when, sitDelay = 400, jumpDelay = 725}: BurpeeScriptProps) => {
    const sitButton = Key.C;
    const jumpButton = Key.SPACE;

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
        getBurpeeScript({when: Key.DOWN}),
    ])
}

main();
