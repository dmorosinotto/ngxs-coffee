interface AppModel {
  // define state here
  coffeeList: Coffee[];
  cart: { name: string; quantity: number }[];
}

//DEFINISCO GloablState COME INTERFACE SFRUTTANDO TS interface open-ended PER "DEFINIRE IN MODO INCREMENTALE LO STATE GLOBALE"
interface GlobalState {
  readonly app: AppModel;
}

interface Coffee {
  name: string;
  price: number;
  recipe: RecipeItem[];
}

interface RecipeItem {
  name: string;
  quantity: number;
}
