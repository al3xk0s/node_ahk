import { getTickByHold, Key, runScript, Cursor, EasingFunctions } from '../dist/index';

const main = () => {
    runScript(
        getTickByHold({
            when: Key.V,
            then: Key.C,
            activate: Key.NUMPAD_0,
        })
    );
}

main();
