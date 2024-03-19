import { Key, ScrollKey } from "../../utils/wrapper/keys";
import { getScrollScripts } from "./scrollScripts";
import { getShifterScript, sixShifterPairs } from "./shifterScripts";
import { getTapKey } from "../../utils/keyboard/tapKey";

import '../../extensions/extensions';
import { getCommonScripts } from "./commonScripts";
import { execScripts } from "../../utils/keyboard/scriptWithDoc";

const main = () => {
  execScripts([
    getScrollScripts({
      scrollUpToggle: Key.THREE,
      scrollDownToggle: Key.FOUR,
      triggerButton: Key.CAPS_LOCK,
      delayMs: 5,
      scrollStep: 100,
    }),

    getShifterScript(Key.NUMPAD_ADD, sixShifterPairs),

    getCommonScripts(),    

    getTapKey({when: Key.UP, then: ScrollKey.UP()}),

    getTapKey({when: Key.DOWN,then: ScrollKey.DOWN()}),
  ]);
}

main();
