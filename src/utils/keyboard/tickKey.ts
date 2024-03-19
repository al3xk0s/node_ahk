import { IKey } from "../wrapper/key";
import { IPhysicalKey } from "../wrapper/physicalKey";
import { doc } from "./doc";
import { wrapToScriptWithDoc } from "./scriptWithDoc";
import { KeyByKeyProps } from "./types";

type TickKeyProps = {
  delayMs?: number,
} & KeyByKeyProps<IPhysicalKey, IKey>;

export const tickKey = ({
  when,
  then,
  delayMs = 50,
}: TickKeyProps) => 
  when.onToggleEnabled((state) => {
    then.tick({needContinue: () => state.isEnabled, delayMs});
  })

export const getTickKey = wrapToScriptWithDoc(
  tickKey, {
  getDoc: ps => doc.tickKey(ps),
});
