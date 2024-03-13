import { IButton, Listener } from "../../utils/wrapper/button";
import { IPhysicalButton } from "../../utils/wrapper/physicalButton";
import { doc } from "./doc";
import { wrapToScriptWithDoc } from "./scriptWithDoc";
import { KeyByKeyProps } from "./types";

export const tapKey = ({
  when,
  then
}: KeyByKeyProps<IPhysicalButton, IButton>) => 
  when.onDown(() => then.tap());


export const getTapKey = wrapToScriptWithDoc(
  tapKey, {
  getDoc: ps => doc.tapKey(ps),
});
