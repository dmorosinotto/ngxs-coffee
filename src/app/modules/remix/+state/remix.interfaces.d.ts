interface RemixModel {
  // define state here
  runningNo: number;
}

//SFRUTTO TS INTERFACE OPEN-ENDED PER AGGIUNGERE remix NEL GlobalState
interface GlobalState {
  readonly remix: RemixModel;
}
