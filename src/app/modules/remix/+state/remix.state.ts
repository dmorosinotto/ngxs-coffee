import { State, StateContext, Action } from "@ngxs/store";
import { NextRunningNo } from "./remix.actions";

//export const getRemixInitialState = (): RemixModel => ({
//  runningNo: 1
//});

@State<RemixModel>({
  name: "remix",
  defaults: {
    //getRemixInitialState()
    runningNo: 1
  }
})
export class RemixState {
  @Action(NextRunningNo)
  nextRunningNo(ctx: StateContext<RemixModel>, action: NextRunningNo) {
    const state = ctx.getState();

    const current = {
      runningNo: state.runningNo + 1
    };

    ctx.setState({
      ...state,
      ...current
    });
  }
}
