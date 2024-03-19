import { doc, wrapToScriptWithDoc } from "@node-ahk/docScript";
import { IPhysicalKey, Key } from "@node-ahk/keys";
import { DisposeWrapper } from "@node-ahk/shared/rx";
import { toggleStateByTap } from "@node-ahk/utils/scripts";

export interface IShifterKey {
    trigger: IPhysicalKey;
    target: IPhysicalKey;
}

export enum Gear {
    first,
    second,
    third,
    four,
    five,
    six,
    back,
    neutral,
}

type KeyGearPair = IShifterKey & { gear: Gear }

export const shifterScript = (toggle: IPhysicalKey, pairs: KeyGearPair[]) => {
    const isEnabled = toggleStateByTap({key: toggle});

    const map = new Map<Gear, KeyGearPair>();
    for (const pair of pairs) {
        map.set(pair.gear, pair);
    }

    let keyGearPair = map.get(Gear.neutral);

    const dw = DisposeWrapper();

    dw.addDisposer(
        isEnabled.listen((value) => !value && keyGearPair?.target.release())
    );

    for (const pair of map.values()) {
        const ls = pair.trigger.onDown(() => {
            if (!isEnabled.value) return;

            keyGearPair?.target.release();
            pair.target.hold();
            keyGearPair = pair;
            console.log(`Shifter turn ${Gear[keyGearPair.gear]}`)
        });

        dw.addDisposer(ls.stop);
    }

    return { stop: dw.dispose }
}

export const getShifterScript = wrapToScriptWithDoc(
    shifterScript, {
    getDoc: (toggle, pairs) => `When ${doc.activate(toggle)}, then shifter works (${pairsToString(pairs)})`,
});


const pairToString = (pair: KeyGearPair) =>
    `${Gear[pair.gear]}: ${pair.trigger.toString()} -> ${pair.target.toString()}`;

const pairsToString = (pairs: KeyGearPair[]) => pairs.map(pairToString).join(', ');

export const fourShifterPairs = [
    {
        gear: Gear.first,
        target: Key.THREE,
        trigger: Key.NUMPAD_7,
    },
    {
        gear: Gear.second,
        target: Key.FOUR,
        trigger: Key.NUMPAD_1,
    },
    {
        gear: Gear.third,
        target: Key.FIVE,
        trigger: Key.NUMPAD_8,
    },
    {
        gear: Gear.four,
        target: Key.SIX,
        trigger: Key.NUMPAD_2,
    },
    {
        gear: Gear.back,
        target: Key.NINE,
        trigger: Key.NUMPAD_0,
    },
    {
        gear: Gear.neutral,
        target: Key.ZERO,
        trigger: Key.NUMPAD_5,
    }
];

export const fiveShifterPairs = [
    ...fourShifterPairs,
    {
        gear: Gear.five,
        target: Key.SEVEN,
        trigger: Key.NUMPAD_9,
    },
];

export const sixShifterPairs = [
    ...fiveShifterPairs,
    {
      gear: Gear.six,
      target: Key.EIGHT,
      trigger: Key.NUMPAD_3,
    },
    
  ];