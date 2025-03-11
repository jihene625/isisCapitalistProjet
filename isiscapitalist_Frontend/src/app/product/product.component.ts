import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WebserviceService } from '../webservice.service';
import { World, Product } from '../models/world.model';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [
    NgForOf,
    NgIf,
    DecimalPipe,
    CommonModule,
  ],
})
export class ProductComponent implements OnInit {
  @Input() product!: Product; // Le produit transmis par le parent

  // Multiplicateur d'achat (x1, x10, x100, ou Max)
  private _qtmulti!: string;
  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this.product && this.money !== undefined) {
      this.calcMaxCanBuy();
    }
  }
  get qtmulti(): string {
    return this._qtmulti;
  }

  // Argent du joueur transmis par le parent
  private _money!: number;
  @Input()
  set money(value: number) {
    this._money = value;
    if (this.product && this.qtmulti) {
      this.calcMaxCanBuy();
      // Pour les produits non débloqués (quantite == 0 et id != 1), verrouiller si l'argent est insuffisant pour 1 exemplaire
      if (this.product.id !== 1 && this.product.quantite === 0) {
        const costOne = this.computeBuyCost(1);
        this.locked = value < costOne;
      }
    }
  }
  get money(): number {
    return this._money;
  }

  // Quantité maximale achetable calculée
  maxBuyable: number = 0;
  // Indique si le produit est verrouillé (flouté) – initialement, les produits autres que le premier le sont si non achetés
  locked: boolean = false;

  // Événements vers le parent
  @Output() notifyProduction: EventEmitter<{ p: Product; qt: number }> = new EventEmitter();
  @Output() notifyWorldUpdate: EventEmitter<World> = new EventEmitter();
  @Output() notifyBuy: EventEmitter<number> = new EventEmitter();

  // Variables de production
  productionInProgress: { [id: number]: boolean } = {};
  lastUpdateTimes: { [id: number]: number } = {};
  productionIntervals: { [id: number]: any } = {};

  constructor(private webservice: WebserviceService) {}

  ngOnInit(): void {
    // Le premier produit (id === 1) est toujours débloqué.
    // Pour les autres, si la quantité est 0, le produit doit être verrouillé indépendamment du money.
    if (this.product.id !== 1 && this.product.quantite === 0) {
      this.locked = true;
    } else {
      this.locked = false;
    }
    this.calcMaxCanBuy();
  }

  // Formate le temps (en ms) en HH.MM.SS
  formatTime(time: number): string {
    const totalSeconds = Math.floor(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')}`;
  }

  // Démarre la production sur clic
  onProductClick(): void {
    if (this.locked) {
      // Si le produit est verrouillé, on vérifie si on a assez d'argent pour acheter 1 exemplaire
      if (this.computeBuyCost(1) <= this.money) {
        // Acheter 1 exemplaire pour débloquer
        this.buyProduct(this.product.id);
      }
      return;
    }
    // Si le produit est débloqué, lancer la production
    if (!this.productionInProgress[this.product.id]) {
      this.startFabrication();
    }
  }

  startFabrication(): void {
    this.productionInProgress[this.product.id] = true;
    this.lastUpdateTimes[this.product.id] = Date.now();
    this.productionIntervals[this.product.id] = setInterval(() => {
      this.calcScore();
    }, 100);
  }

  calcScore(): void {
    const now = Date.now();
    const elapsed = now - this.lastUpdateTimes[this.product.id];
    this.lastUpdateTimes[this.product.id] = now;
    if (elapsed >= this.product.vitesse) {
      const qt = 1;
      this.notifyProduction.emit({ p: this.product, qt: qt });
      this.stopFabrication();
    }
  }

  stopFabrication(): void {
    this.productionInProgress[this.product.id] = false;
    if (this.productionIntervals[this.product.id]) {
      clearInterval(this.productionIntervals[this.product.id]);
      this.productionIntervals[this.product.id] = null;
    }
  }

  // Calcule la quantité maximale achetable pour ce produit
  calcMaxCanBuy(): void {
    const x = this.product.cout;
    const c = this.product.croissance;
    let moneyAvailable = this.money;
    let n = 0;
    if (c === 1) {
      n = Math.floor(moneyAvailable / x);
    } else {
      while (true) {
        const cost = x * ((1 - Math.pow(c, n + 1)) / (1 - c));
        if (cost > moneyAvailable) break;
        n++;
      }
    }
    this.maxBuyable = n;
  }

  // Calcule le coût total pour acheter "quantite" unités du produit
  computeBuyCost(quantite: number): number {
    const x = this.product.cout;
    const c = this.product.croissance;
    if (c === 1) {
      return x * quantite;
    } else {
      return x * ((1 - Math.pow(c, quantite)) / (1 - c));
    }
  }

  // Renvoie la quantité à acheter selon le multiplicateur
  getQuantiteToBuy(): number {
    if (this.qtmulti === 'Max') {
      return this.maxBuyable;
    } else {
      return parseInt(this.qtmulti.replace('x', ''), 10);
    }
  }

  // Vérifie si l'achat est possible avec l'argent actuel
  canBuy(): boolean {
    const quantite = this.getQuantiteToBuy();
    const totalCost = this.computeBuyCost(quantite);
    return totalCost <= this.money;
  }

  // Méthode pour acheter un produit
  buyProduct(productId: number): void {
    let quantite: number;
    if (this.locked) {
      // Si le produit est verrouillé, on force l'achat de 1 exemplaire pour débloquer
      quantite = 1;
    } else {
      quantite = this.getQuantiteToBuy();
    }
    this.webservice.acheterQtProduit('toto', productId, quantite)
      .then((updatedProduct: Product) => {
        console.log("Produit acheté :", updatedProduct);
        return this.webservice.getWorld();
      })
      .then((newWorld: World) => {
        // Notifier le parent avec le world mis à jour
        this.notifyWorldUpdate.emit(newWorld);
        const totalCost = this.computeBuyCost(quantite);
        this.notifyBuy.emit(totalCost);
        // Si le produit était verrouillé, débloquez-le définitivement
        if (this.locked) {
          this.locked = false;
        }
      })
      .catch((err: any) => console.error("Erreur lors de l'achat du produit :", err));
  }

}
