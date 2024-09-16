import { IPhysicalKey } from "@node-ahk/keys";
import { DocUtils, wrapToScriptWithDoc } from "@node-ahk/docScript";
import { KeyByKeyProps } from "./types";

/**
 * @param when - переключает состояние скрипта (активное / неактивное).
 * @param then - при активном состоянии будет зажата.
 */
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

/**
 * Версия со встроенной документацией.
 * 
 * @returns функция {@link holdKey}.
 */
export const getHoldKey = wrapToScriptWithDoc(
  holdKey, {
  getDoc: ps => DocUtils.holdKey(ps),
});
