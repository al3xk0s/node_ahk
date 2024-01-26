import { toggleStateByTap } from "../../utils/keyboard/toggleStateByTap";
import { IButton } from "../../utils/wrapper/button";
import { IPhysicalButton } from "../../utils/wrapper/physicalButton";

export const tickKey = (
  trigger: IPhysicalButton,
  target: IButton,
  delayMs: number = 50,
) => {
  trigger.onToggleEnabled((state) => {
    target.tick({needContinue: () => state.isEnabled, delayMs});
  })
}
