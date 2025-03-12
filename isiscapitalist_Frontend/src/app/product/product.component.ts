import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WebserviceService } from '../webservice.service';
import { World, Product } from '../models/world.model';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MyProgressBarComponent, Orientation } from '../my-progress-bar/my-progress-bar.component';

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
    MyProgressBarComponent
  ],
})
export class ProductComponent implements OnInit {
  @Input() product!: Product; // Le produit transmis par le parent

  // Propriétés pour la barre de progression
  progressInitialValue: number = 0;
  progressVitesse: number = this.product ? this.product.vitesse : 500;
  // progressRun contrôle l'affichage de la barre (true quand la production est active)
  progressRun: boolean = false;
  Orientation = Orientation; // Pour utiliser dans le template

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
  // Indique si le produit est verrouillé (flouté)
  locked: boolean = false;
  // Temps cumulé pour la production (en ms) qui sert à la barre de progression
  progressTime: number = 0;

  // Événements vers le parent
  @Output() notifyProduction: EventEmitter<{ p: Product; qt: number }> = new EventEmitter();
  @Output() notifyWorldUpdate: EventEmitter<World> = new EventEmitter();
  @Output() notifyBuy: EventEmitter<number> = new EventEmitter();

  // Variables de production pour gérer les intervalles
  productionInProgress: { [id: number]: boolean } = {};
  lastUpdateTimes: { [id: number]: number } = {};
  productionIntervals: { [id: number]: any } = {};

  constructor(private webservice: WebserviceService) {}

  ngOnInit(): void {
    // Le premier produit (id === 1) est toujours débloqué.
    // Les autres sont verrouillés tant qu'ils n'ont pas été achetés.
    this.locked = (this.product.id !== 1 && this.product.quantite === 0);
    this.calcMaxCanBuy();
  }

  // Arrête la production et la barre de progression
  stopProduction(): void {
    this.progressRun = false;
  }

  // Formate le temps (en ms) en format HH.MM.SS
  formatTime(time: number): string {
    const totalSeconds = Math.floor(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')}`;
  }

  // Méthode déclenchée au clic sur le produit
  onProductClick(): void {
    if (this.locked) {
      // Si le produit est verrouillé, tenter d'acheter 1 exemplaire pour le débloquer
      if (this.computeBuyCost(1) <= this.money) {
        this.buyProduct(this.product.id);
      }
      return;
    }
    // Si la production n'est pas déjà en cours, la démarrer
    if (!this.productionInProgress[this.product.id]) {
      this.startFabrication();
    }
  }

  // Démarre la production et la barre de progression
  startFabrication(): void {
    this.productionInProgress[this.product.id] = true;
    this.lastUpdateTimes[this.product.id] = Date.now();
    this.progressTime = 0; // Réinitialise la progression
    // Lance une boucle qui met à jour la progression toutes les 100ms
    this.productionIntervals[this.product.id] = setInterval(() => {
      this.calcScore();
    }, 100);
    // Démarre l'affichage de la barre
    this.progressInitialValue = 0;
    this.progressRun = true;
  }

  // Met à jour la production et la progression
  calcScore(): void {
    const now = Date.now();
    const elapsed = now - this.lastUpdateTimes[this.product.id];
    this.lastUpdateTimes[this.product.id] = now;
    this.progressTime += elapsed;
    if (this.progressTime >= this.product.vitesse) {
      // Forcer la progression à 100%
      this.progressTime = this.product.vitesse;
      // Émettre l'événement de production
      const qt = 1;
      this.notifyProduction.emit({ p: this.product, qt: qt });
      // Attendre un court instant pour que la barre affiche 100% avant de se réinitialiser
      setTimeout(() => {
        this.stopFabrication();
        this.stopProduction();
      }, 100); // délai de 100 ms (ajustable selon vos besoins)
    }
  }

  // Arrête la production en cours
  stopFabrication(): void {
    this.productionInProgress[this.product.id] = false;
    if (this.productionIntervals[this.product.id]) {
      clearInterval(this.productionIntervals[this.product.id]);
      this.productionIntervals[this.product.id] = null;
    }
    // Remet la progression à 0
    this.progressTime = 0;
    // Désactive l'affichage de la barre
    this.progressRun = false;
  }


  // Calcule la quantité maximale achetable
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

  // Renvoie la quantité à acheter selon le multiplicateur global
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
      quantite = 1;
    } else {
      quantite = this.getQuantiteToBuy();
    }
    this.webservice.acheterQtProduit('user', productId, quantite)
      .then((updatedProduct: Product) => {
        console.log("Produit acheté :", updatedProduct);
        return this.webservice.getWorld();
      })
      .then((newWorld: World) => {
        this.notifyWorldUpdate.emit(newWorld);
        const totalCost = this.computeBuyCost(quantite);
        this.notifyBuy.emit(totalCost);
        if (this.locked) {
          this.locked = false;
        }
      })
      .catch((err: any) => console.error("Erreur lors de l'achat du produit :", err));
  }

  // Calcule le pourcentage de progression (0 à 100) pour la barre
  getProgressPercent(): number {
    if (!this.product.vitesse) return 0;
    const ratio = this.progressTime / this.product.vitesse;
    const percent = ratio * 100;
    return Math.max(0, Math.min(100, percent));
  }
}
