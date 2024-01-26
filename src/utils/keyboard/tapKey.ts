import { IButton } from "../../utils/wrapper/button";
import { IPhysicalButton } from "../../utils/wrapper/physicalButton";

export const tapKey = (
  trigger: IPhysicalButton,
  target: IButton
) => {
  trigger.onDown(() => target.tap());
}