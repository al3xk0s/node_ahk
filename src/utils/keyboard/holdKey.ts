import { IPhysicalButton } from "../wrapper/physicalButton";
import { KeyByKeyProps } from "./types";
import { doc } from "./doc";
import { wrapToScriptWithDoc } from "./scriptWithDoc";

export const holdKey = ({
  when,
  then
}: KeyByKeyProps<IPhysicalButton, IPhysicalButton>) => {
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
