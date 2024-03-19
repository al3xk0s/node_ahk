import { IKey, IPhysicalKey } from "@node-ahk/keys";
import { doc, wrapToScriptWithDoc } from "@node-ahk/docScript";
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
