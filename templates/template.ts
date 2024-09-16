import { getTickByHold, Key } from '../dist/index';

const main = () => {
    getTickByHold({
        when: Key.V,
        then: Key.C,
        activate: Key.NUMPAD_0,
    })()
}

main();
