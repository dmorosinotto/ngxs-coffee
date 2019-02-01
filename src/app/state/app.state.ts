import { State, Action, StateContext, Selector } from "@ngxs/store";
import { Injector } from "@angular/core";
import { Receiver, EmitterAction } from "@ngxs-labs/emitter";

import { CoffeeService } from "../services/coffee.service";

//UTILIZZO DI IMMER ADAPTER PER SEMPLIFICARE SCRITTURA REDUCER IN MODO MUTABLE - PROXY FOR THE WIN!
import { produce } from "@ngxs-labs/immer-adapter";
import { AddToCoffeeList } from "./app.actions";

export const getAppInitialState = (): AppModel => ({
  coffeeList: [],
  cart: []
});

@State<AppModel>({
  name: "app",
  defaults: getAppInitialState()
})
export class AppState {
  private static coffeeSvc: CoffeeService;
  constructor(injector: Injector) {
    AppState.coffeeSvc = injector.get<CoffeeService>(CoffeeService);
  }

  @Selector()
  static coffeeList(state: AppModel) {
    return state.coffeeList;
  }

  @Selector()
  static totalCartAmount(state: AppModel) {
    const priceList = state.cart.map(c => {
      const unitPrice = state.coffeeList.find(x => x.name === c.name).price;
      return unitPrice * c.quantity;
    });
    const sum = priceList.reduce((acc, curr) => acc + curr, 0);

    return sum;
  }

  // @Action(GetCoffeeList)
  @Receiver()
  static async getCoffeeList(ctx: StateContext<AppModel>, action: EmitterAction<Coffee[]>) {
    const coffeeList = await AppState.coffeeSvc.getList();
    // const state = ctx.getState();
    // ctx.setState({
    //     ...state,
    //     coffeeList
    // });
    produce(ctx, state => {
      //RISCRITTURA CON IMMER DEL CODICE SOPRA
      state.coffeeList = coffeeList;
    });
  }

  @Receiver()
  static addToCart(ctx: StateContext<AppModel>, action: EmitterAction<string>) {
    // const state = ctx.getState();

    // // find cart item by item name
    // const { quantity = 0 } = state.cart.find(x => x.name === action.payload) || {};

    // const current = {
    //   cart: [
    //     ...state.cart.filter(x => x.name !== action.payload),
    //     {
    //       name: action.payload,
    //       quantity: quantity + 1
    //     }
    //   ]
    // };

    // ctx.setState({
    //   ...state,
    //   ...current
    // });
    produce(ctx, state => {
      //RISCRITTURA CON IMMER DEL CODICE SOPRA - MUTABALE & PROXY FOR THE WIN!
      let item = state.cart.find(c => c.name === action.payload);
      if (item) /*QUESTO E' AS SUA VOLTA UN PROXY APPENA LO MODIFICO! */ item.quantity += 1;
      else state.cart.push({ name: action.payload, quantity: 1 }); //FIGATA POSSO FARE DIRETTAMENTE IL PUSH SU ARRAY X MUTARLO
    });
  }

  @Receiver()
  static addOneCartItem(ctx: StateContext<AppModel>, action: EmitterAction<string>) {
    this.addToCart(ctx, action);
  }

  @Receiver()
  static removeCartItem(ctx: StateContext<AppModel>, { payload }: EmitterAction<string>) {
    // const state = ctx.getState();

    // const current = {
    //   cart: [...state.cart.filter(x => x.name !== action.payload)]
    // };

    // ctx.setState({
    //   ...state,
    //   ...current
    // });
    produce(ctx, state => {
      //RISCRITTURA CON IMMER DEL CODICE SOPRA - MUTABALE FOR THE WIN!
      const idx = state.cart.findIndex(c => c.name === payload);
      if (idx >= 0) state.cart.splice(idx, 1);
    });
  }

  @Receiver()
  static removeOneCartItem(ctx: StateContext<AppModel>, action: EmitterAction<string>) {
    // const state = ctx.getState();

    // const item = state.cart.find(x => x.name === action.payload);

    // const current = {
    //   cart: [
    //     ...state.cart.filter(x => x.name !== action.payload),
    //     ...(item.quantity - 1 <= 0 ? [] : [{ name: item.name, quantity: item.quantity - 1 }])
    //   ]
    // };

    // ctx.setState({
    //   ...state,
    //   ...current
    // });
    produce(ctx, state => {
      //RISCRITTURA DEL CODICE SOPRA CON IMMER
      let item = state.cart.find(c => c.name === action.payload);
      if (item) {
        //ANCHE ITEM E' UN PROXY APPENA LO MODIFICO
        if (item.quantity > 1) item.quantity--;
        else state.cart = state.cart.filter(c => c != item); //RIMUOVO ITEM DALL'ARRAY IN MODO "IMMUTABLE"
        //MA AVREI POSSO RIMUOVERE ITEM ANCHE MUTANDO DIRETTAMENTE ARRAY state.cart.splice(idx, 1);
      }
    });
  }

  @Receiver()
  static emptyCart(ctx: StateContext<AppModel>) {
    // const state = ctx.getState();

    // const current = {
    //   cart: []
    // };

    // ctx.setState({
    //   ...state,
    //   ...current
    // });
    produce(ctx, state => {
      //RISCRITTURA CON IMMER DEL CODICE SOPRA
      state.cart = [];
    });
  }

  @Receiver({ action: AddToCoffeeList })
  static addToCoffeeList(ctx: StateContext<AppModel>, action: AddToCoffeeList) {
    // const state = ctx.getState();

    // const current = {
    //   coffeeList: [...state.coffeeList, ...action.payload]
    // };

    // ctx.setState({
    //   ...state,
    //   ...current
    // });
    produce(ctx, state => {
      //RISCRITTURA CON IMMER DEL CODICE SOPRA - MUTABLE & PROXY FOR THE WIN!
      state.coffeeList.push(...action.payload);
    });
  }
}
