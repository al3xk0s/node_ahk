import { Key } from "suchibot";
import { PhysicalKeyboardButton } from "../../utils/wrapper/physicalButton";
import { getTickKey } from "../../utils/keyboard/tickKey";
import { getScrollScripts } from "./scrollScripts";
import { getShifterScript, sixShifterPairs } from "./shifterScripts";
import { getTapKey } from "../../utils/keyboard/tapKey";
import { ScrollDownAsButton, ScrollUpAsButton } from "../../utils/wrapper/scrollAsButton";

import '../../extensions/extensions';
import { getHoldKey } from "../../utils/keyboard/holdKey";
import { getCommonScripts } from "./commonScripts";
import { doc } from "../../utils/keyboard/doc";
import { execScripts } from "../../utils/keyboard/scriptWithDoc";

const main = () => {
  execScripts([
    getScrollScripts({
      scrollUpToggle: PhysicalKeyboardButton(Key.THREE),
      scrollDownToggle: PhysicalKeyboardButton(Key.FOUR),
      triggerButton: PhysicalKeyboardButton(Key.CAPS_LOCK),
      delayMs: 5,
      scrollStep: 100,
    }),

    getShifterScript(PhysicalKeyboardButton(Key.NUMPAD_ADD), sixShifterPairs),

    getCommonScripts(),

    getHoldKey({when: PhysicalKeyboardButton(Key.PAGE_DOWN), then: PhysicalKeyboardButton(Key.LEFT_CONTROL)}),

    getTapKey({when: PhysicalKeyboardButton(Key.UP), then: ScrollUpAsButton()}),

    getTapKey({when: PhysicalKeyboardButton(Key.DOWN),then: ScrollDownAsButton()}),
  ]);
}

main();
