import { IKey, IPhysicalKey } from "@node-ahk/keys";
import { DocUtils, wrapToScriptWithDoc } from "@node-ahk/docScript";
import { KeyByKeyProps } from "./types";
import { toggleStateByTap } from "./toggleStateByTap";
import { combineListeners, toListener } from "../listenersUtils";

type TickKeyProps = {
  delayMs?: number,
} & KeyByKeyProps<IPhysicalKey, IKey>;

/**
 * @param when переключает состояние скрипта (активное / неактивное). 
 * @param then при активном состоянии скрипта с определенной периодичностью совершаются нажатия.
 * @param delayMs задержка между тиками.
 */
export const tickKey = ({
  when,
  then,
  delayMs = 50,
}: TickKeyProps) => 
  when.onToggleEnabled(() => then.tick({delayMs}), { onDisable: () => then.releaseTick() })

/**
 * Версия с документацией.
 * 
 * @returns функция {@link tickKey}
 */
export const getTickKey = wrapToScriptWithDoc(
  tickKey, {
  getDoc: ps => DocUtils.tickKey(ps),
});

/**
 * @param activate переключает состояние между активным / неактивным.
 * @param when в случае активного состояния, при зажатии клавиши происходит многократное нажатие `then`.
 * 
 * @returns функция с документацией. 
 */
export const getTickByHold = wrapToScriptWithDoc(
  ({when, then, activate}: KeyByKeyProps & { activate: IPhysicalKey }) => {
      const activateScriptState = toggleStateByTap({key: activate});

      return combineListeners([
          toListener(activateScriptState.listen((v) => { if(!v) then.releaseTick() })),
  
          when.onHold(() => {            
              if(!activateScriptState.isEnabled) return;
  
              then.tick();
          }, { onDisable: () => then.releaseTick() }),
      ]);

  }, {
  getDoc: ({when, then, activate}) => [
      `When ${DocUtils.tap(activate)}, then activate script`,
      '',
      `When ${DocUtils.hold(when)}, then ${DocUtils.hold(then)}`,
  ]}
);
