import { IKey, IPhysicalKey } from "@node-ahk/keys";
import { doc, wrapToScriptWithDoc } from "@node-ahk/docScript";
import { KeyByKeyProps } from "./types";
import { toggleStateByTap } from "./toggleStateByTap";
import { combineListeners, toListener } from "../listenersUtils";

type TickKeyProps = {
  delayMs?: number,
} & KeyByKeyProps<IPhysicalKey, IKey>;

export const tickKey = ({
  when,
  then,
  delayMs = 50,
}: TickKeyProps) => 
  when.onToggleEnabled(() => then.tick({delayMs}), { onDisable: () => then.releaseTick() })

export const getTickKey = wrapToScriptWithDoc(
  tickKey, {
  getDoc: ps => doc.tickKey(ps),
});

export const getTickByHold = wrapToScriptWithDoc(
  ({when, then, activate}: KeyByKeyProps & { activate: IPhysicalKey }) => {
      const activateScriptState = toggleStateByTap({key: activate});

      return combineListeners([
          toListener(activateScriptState.listen((v) => { if(!v) then.releaseTick() })),
  
          when.onHold(() => {            
              if(!activateScriptState.isEnabled) return;
  
              then.tick();
          }, () => then.releaseTick()),
      ]);

  }, {
  getDoc: ({when, then, activate}) => [
      `When ${doc.tap(activate)}, then activate script`,
      '',
      `When ${doc.hold(when)}, then ${doc.hold(then)}`,
  ]}
);