import { IKey, IPhysicalKey } from "@node-ahk/keys";
import { DocUtils, wrapToScriptWithDoc } from "@node-ahk/docScript";
import { KeyByKeyProps } from "./types";

/**
 * По нажатию на `when` происходит нажатие клавиши `then`.
 */
export const tapKey = ({
  when,
  then
}: KeyByKeyProps<IPhysicalKey, IKey>) => 
  when.onDown(() => then.tap());

/**
 * Версия с документацией.
 * 
 * @returns функция {@link tapKey}.
 */
export const getTapKey = wrapToScriptWithDoc(
  tapKey, {
  getDoc: ps => DocUtils.tapKey(ps),
});
