import { getHoldKey } from "../../utils/keyboard/holdKey";
import { getTickKey } from "../../utils/keyboard/tickKey";
import { PhysicalKeyboardButton } from "../../utils/wrapper/physicalButton";
import { ScriptWithDoc, combineScriptsWithDoc } from "../../utils/keyboard/scriptWithDoc";
import { Key } from "../../utils/suchibot";

export const getCommonScripts = () : ScriptWithDoc => 
    combineScriptsWithDoc([
        getHoldKey({when: PhysicalKeyboardButton(Key.NUMPAD_DIVIDE), then: PhysicalKeyboardButton(Key.W)}),
        getHoldKey({when: PhysicalKeyboardButton(Key.NUMPAD_MULTIPLY), then: PhysicalKeyboardButton(Key.LEFT_SHIFT)}),
        getHoldKey({when: PhysicalKeyboardButton(Key.PAGE_DOWN), then: PhysicalKeyboardButton(Key.LEFT_CONTROL)}),
        getTickKey({when: PhysicalKeyboardButton(Key.END), then: PhysicalKeyboardButton(Key.N)}),
        getTickKey({when: PhysicalKeyboardButton(Key.DELETE), then: PhysicalKeyboardButton(Key.SPACE)}),
    ]);
