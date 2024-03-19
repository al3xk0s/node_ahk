import { IPhysicalKey } from "../wrapper/physicalKey";
import { KeyByKeyProps } from "./types";
import { doc } from "./doc";
import { wrapToScriptWithDoc } from "./scriptWithDoc";

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
