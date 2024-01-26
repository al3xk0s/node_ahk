import { Key } from "suchibot";
import { toggleStateByTap } from "../../utils/keyboard/toggleStateByTap";
import { IPhysicalButton, PhysicalKeyboardButton } from "../../utils/wrapper/physicalButton"

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
    for(const pair of pairs) {
        map.set(pair.gear, pair);
    }

    let keyGearPair = map.get(Gear.neutral);

    isEnabled.listen((value) => !value && keyGearPair?.target.release());

    for(const pair of map.values()) {
        pair.trigger.onDown(() => {            
            if(!isEnabled.value) return;
            
            keyGearPair?.target.release();
            pair.target.hold();
            keyGearPair = pair;
            console.log(`Shifter turn ${Gear[keyGearPair.gear]}`)
        })
    }
}

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