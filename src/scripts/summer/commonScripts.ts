import { getHoldKey } from "../../utils/keyboard/holdKey";
import { getTickKey } from "../../utils/keyboard/tickKey";
import { ScriptWithDoc, combineScriptsWithDoc } from "../../utils/keyboard/scriptWithDoc";
import { Key } from "../../utils/wrapper/keys";

export const getCommonScripts = () : ScriptWithDoc => 
    combineScriptsWithDoc([
        getHoldKey({when: Key.NUMPAD_DIVIDE, then: Key.W}),
        getHoldKey({when: Key.NUMPAD_MULTIPLY, then: Key.LEFT_SHIFT}),
        getHoldKey({when: Key.PAGE_DOWN, then: Key.LEFT_CONTROL}),
        getTickKey({when: Key.END, then: Key.N}),
        getTickKey({when: Key.DELETE, then: Key.SPACE}),
    ]);
