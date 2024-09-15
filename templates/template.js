const { runScripts, getTickByHold, Key } = require('../dist/index');

const main = () => {
    runScripts([
        getTickByHold({
            when: Key.V,
            then: Key.C,
            activate: Key.NUMPAD_0,
        })
    ]);
}

main();
