import { Key } from "suchibot";
import { getHoldKey } from "../../utils/keyboard/holdKey";
import { getTickKey } from "../../utils/keyboard/tickKey";
import { PhysicalKeyboardButton } from "../../utils/wrapper/physicalButton";
import { ScriptWithDoc, combineScriptsWithDoc } from "../../utils/keyboard/scriptWithDoc";

export const getCommonScripts = () : ScriptWithDoc => 
    combineScriptsWithDoc([
        getHoldKey({when: PhysicalKeyboardButton(Key.HOME), then: PhysicalKeyboardButton(Key.W)}),
        getHoldKey({when: PhysicalKeyboardButton(Key.PAGE_UP), then: PhysicalKeyboardButton(Key.LEFT_SHIFT)}),
        getTickKey({when: PhysicalKeyboardButton(Key.END), then: PhysicalKeyboardButton(Key.N)}),
        getTickKey({when: PhysicalKeyboardButton(Key.DELETE), then: PhysicalKeyboardButton(Key.SPACE)}),
    ]);

