import { Key } from '@node-ahk/keys';
import { getTickByHold } from '@node-ahk/utils/scripts';

const main = () => {
    getTickByHold({
        when: Key.V,
        then: Key.C,
        activate: Key.NUMPAD_0,
    })()
}

main();
