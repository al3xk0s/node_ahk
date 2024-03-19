import { IKey, Listener } from "../wrapper/key";
import { IPhysicalKey } from "../wrapper/physicalKey";
import { doc } from "./doc";
import { wrapToScriptWithDoc } from "./scriptWithDoc";
import { KeyByKeyProps } from "./types";

export const tapKey = ({
  when,
  then
}: KeyByKeyProps<IPhysicalKey, IKey>) => 
  when.onDown(() => then.tap());


export const getTapKey = wrapToScriptWithDoc(
  tapKey, {
  getDoc: ps => doc.tapKey(ps),
});
