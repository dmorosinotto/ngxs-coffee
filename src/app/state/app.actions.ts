/* coffee list */

// export class GetCoffeeList {
//     static readonly type = '[Coffee API] GET_COFFEE_LIST';
//     constructor() { }
// }

export class AddToCoffeeList {
  //DEFINIZIONE DI AZIONE CLASSICA USATA POI NEL Remix Feature Module
  static readonly type = "[Coffee CUSTOM] ADD_NEW_CUSTOM_COFFEE";
  constructor(public payload: Coffee[]) {}
}
