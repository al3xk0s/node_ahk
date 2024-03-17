import { toggleStateByTap } from "../../utils/keyboard/toggleStateByTap";
import { IPhysicalButton, PhysicalKeyboardButton } from "../../utils/wrapper/physicalButton"
import { doc } from "../../utils/keyboard/doc";
import { wrapToScriptWithDoc } from "../../utils/keyboard/scriptWithDoc";
import { DisposeWrapper } from "../../shared/utils/observable";
import { Key } from "../../utils/suchibot";

export interface IShifterKey {
    trigger: IPhysicalButton;
    target: IPhysicalButton;
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

export const shifterScript = (toggle: IPhysicalButton, pairs: KeyGearPair[]) => {
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
        target: PhysicalKeyboardButton(Key.THREE),
        trigger: PhysicalKeyboardButton(Key.NUMPAD_7),
    },
    {
        gear: Gear.second,
        target: PhysicalKeyboardButton(Key.FOUR),
        trigger: PhysicalKeyboardButton(Key.NUMPAD_1),
    },
    {
        gear: Gear.third,
        target: PhysicalKeyboardButton(Key.FIVE),
        trigger: PhysicalKeyboardButton(Key.NUMPAD_8),
    },
    {
        gear: Gear.four,
        target: PhysicalKeyboardButton(Key.SIX),
        trigger: PhysicalKeyboardButton(Key.NUMPAD_2),
    },
    {
        gear: Gear.back,
        target: PhysicalKeyboardButton(Key.NINE),
        trigger: PhysicalKeyboardButton(Key.NUMPAD_0),
    },
    {
        gear: Gear.neutral,
        target: PhysicalKeyboardButton(Key.ZERO),
        trigger: PhysicalKeyboardButton(Key.NUMPAD_5),
    }
];

export const fiveShifterPairs = [
    ...fourShifterPairs,
    {
        gear: Gear.five,
        target: PhysicalKeyboardButton(Key.SEVEN),
        trigger: PhysicalKeyboardButton(Key.NUMPAD_9),
    },
];

export const sixShifterPairs = [
    ...fiveShifterPairs,
    {
      gear: Gear.six,
      target: PhysicalKeyboardButton(Key.EIGHT),
      trigger: PhysicalKeyboardButton(Key.NUMPAD_3),
    },
    
  ];