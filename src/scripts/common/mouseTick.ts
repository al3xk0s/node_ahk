import { runScripts } from "@node-ahk/docScript";
import { getTickByHold } from "@node-ahk/utils/scripts";
import { Key, MouseKey } from "@node-ahk/keys";

const main = () => runScripts([
    getTickByHold({when: Key.F, then: MouseKey.LEFT, activate: Key.NUMPAD_ADD}),
    getTickByHold({when: Key.G, then: Key.E, activate: Key.NUMPAD_ADD}),
]);

main();
