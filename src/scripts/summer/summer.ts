import { Key } from "suchibot";
import { PhysicalKeyboardButton } from "../../utils/wrapper/physicalButton";
import { holdKey } from "../../utils/keyboard/holdKey";
import { tickKey } from "../../utils/keyboard/tickKey";
import { scrollScripts } from "./scrollScripts";
import { shifterScript, sixShifterPairs } from "./shifterScripts";
import { tapKey } from "../../utils/keyboard/tapKey";
import { ScrollDownAsButton, ScrollUpAsButton } from "../../utils/wrapper/scrollAsButton";

const main = () => {
  scrollScripts({
    scrollUpToggle: PhysicalKeyboardButton(Key.THREE),
    scrollDownToggle: PhysicalKeyboardButton(Key.FOUR),
    triggerButton: PhysicalKeyboardButton(Key.CAPS_LOCK),
    delayMs: 5,
    scrollStep: 100,
  });

  shifterScript(PhysicalKeyboardButton(Key.NUMPAD_ADD), sixShifterPairs);
  holdKey(PhysicalKeyboardButton(Key.HOME), PhysicalKeyboardButton(Key.W));
  holdKey(PhysicalKeyboardButton(Key.PAGE_UP), PhysicalKeyboardButton(Key.LEFT_SHIFT));
  holdKey(PhysicalKeyboardButton(Key.PAGE_DOWN), PhysicalKeyboardButton(Key.LEFT_CONTROL));
  tickKey(PhysicalKeyboardButton(Key.END), PhysicalKeyboardButton(Key.N));
  tapKey(PhysicalKeyboardButton(Key.UP), ScrollUpAsButton());
  tapKey(PhysicalKeyboardButton(Key.DOWN), ScrollDownAsButton());
}

main();
