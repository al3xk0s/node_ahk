import '@node-ahk/extensions/extensions';

import { execScripts } from '@node-ahk/docScript';
import { Key, ScrollKey } from '@node-ahk/keys';
import { getTapKey } from '@node-ahk/utils/scripts';
import { getCommonScripts } from './commonScripts';
import { getScrollScripts } from './scrollScripts';
import { getShifterScript, sixShifterPairs } from './shifterScripts';


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
