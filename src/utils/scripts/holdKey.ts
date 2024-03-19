import { IPhysicalKey } from "@node-ahk/keys";
import { doc, wrapToScriptWithDoc } from "@node-ahk/docScript";
import { KeyByKeyProps } from "./types";

export const holdKey = ({
  when,
  then
}: KeyByKeyProps<IPhysicalKey, IPhysicalKey>) => {
  return when.onToggleEnabled(() => {
    then.hold();
  }, {
    onDisable: () => {
      then.release();
    }
  })
}

export const getHoldKey = wrapToScriptWithDoc(
  holdKey, {
  getDoc: ps => doc.holdKey(ps),
});
