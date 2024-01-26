import { IPhysicalButton } from "../wrapper/physicalButton";

export const holdKey = (
  trigger: IPhysicalButton,
  key: IPhysicalButton,
) => {
  trigger.onToggleEnabled(() => {
    key.hold();
  }, {
    onDisable: () => {
      key.release();
    }
  })

  // let isHold = false;

  // trigger.onDown(() => {
  //   if(isHold) {
  //     key.release();
  //     isHold = false;
  //     return;
  //   }

  //   key.hold();
  //   isHold = true;
  // })
}