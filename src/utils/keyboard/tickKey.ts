import { IButton } from "../../utils/wrapper/button";
import { IPhysicalButton } from "../../utils/wrapper/physicalButton";
import { doc } from "./doc";
import { wrapToScriptWithDoc } from "./scriptWithDoc";
import { KeyByKeyProps } from "./types";

type TickKeyProps = {
  delayMs?: number,
} & KeyByKeyProps<IPhysicalButton, IButton>;

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
