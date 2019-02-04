import { NextRunningNo } from "./remix.actions";
import { NgxsModule, Store } from "@ngxs/store";
import { RemixState /*, getRemixInitialState*/ } from "./remix.state";
import { TestBed, async } from "@angular/core/testing";
import { stateNameErrorMessage } from "@ngxs/store/src/decorators/state";

describe("Remix Reducer", () => {
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([RemixState])]
    }).compileComponents();

    store = TestBed.get(Store);
  }));

  describe("NEXT_RUNNING_NO", () => {
    it("should increase runnning no", () => {
      // arrange
      const expectedState: RemixModel = {
        //...getRemixInitialState(),
        runningNo: 5
      };

      // TODO: simpler way to setup default state?
      store.dispatch([new NextRunningNo(), new NextRunningNo(), new NextRunningNo()]);

      // action
      const action = new NextRunningNo();
      store.dispatch(action);

      store
        .selectOnce((state: GlobalState) => state.remix)
        .subscribe(actual => {
          // assert
          expect(actual).toEqual(expectedState);
        });
    });
  });
});
