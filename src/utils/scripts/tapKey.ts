import { IKey, IPhysicalKey } from "@node-ahk/keys";
import { doc, wrapToScriptWithDoc } from "@node-ahk/docScript";
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
