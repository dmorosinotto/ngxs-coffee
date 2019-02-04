import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Store } from "@ngxs/store";
import { take, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { NextRunningNo } from "../../+state/remix.actions";
import { AddToCoffeeList } from "src/app/state/app.actions";

@Component({
  selector: "app-customize-page",
  templateUrl: "./customize-page.component.html",
  styleUrls: ["./customize-page.component.css"]
})
export class CustomizePageComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();

  readonly ingredients: string[] = [
    "chocolate syrup",
    "espresso",
    "milk foam",
    "steamed milk",
    "whipped cream",
    "water"
  ];

  coffee: Coffee;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {}

  ngOnInit() {
    const { template = "" } = this.route.snapshot.queryParams;

    this.store
      .select((x: GlobalState) => ({
        //DEFINISCO LO STATO GLOBALE = App=BASE + Remix=FEATURE
        template: x.app.coffeeList.find(c => c.name === template),
        runningNo: x.remix.runningNo
      }))
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        // get template recipe if any
        const templateRecipe = x.template ? x.template.recipe : [];

        // merge template recipe with default recipe
        const recipe = this.ingredients.map(ing => {
          const item = templateRecipe.find(r => r.name === ing) || { name: ing, quantity: 0 };
          return item;
        });

        this.coffee = {
          name: "Special Cafe " + x.runningNo.toString().padStart(2, "0"),
          price: 20,
          recipe
        };
      });
  }

  addToList(coffee: Coffee) {
    // actions
    // this.store.dispatch(new AddToCart(coffee.name));

    this.store.dispatch([
      //ESEMPIO DI DISPATCH DI PIU' AZIONI IN SEQUENZA
      new AddToCoffeeList([this.coffee]), //AGGIUNGE NUOVO CAFFE AL LISTINO
      new NextRunningNo() //INCREMENTA IL CONTATORE NUOVI CUSTOM CAFFE PRONTO PER LA PROX RICETTA
    ]);
    // route
    this.router.navigateByUrl("/menu");
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
