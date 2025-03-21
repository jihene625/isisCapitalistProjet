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
  @Input() world!: World; // Le produit transmis par le parent

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
      if (this.product.id !== 1 && this.product.quantite === 0 && !this.unlockedManually) {
        this.locked = true;
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
  // Indique si l'utilisateur a débloqué le produit par un clic explicite
  unlockedManually: boolean = false;
  // Temps cumulé pour la production (en ms) qui sert à la barre de progression
  progressTime: number = 0;
  unlockPending: boolean = false;


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
    // Pour le rechargement, initialiser la progression en fonction de timeleft
    if (this.product.timeleft && this.product.timeleft > 0) {
      this.progressInitialValue = this.product.timeleft;
    }
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
      // Si le produit est verrouillé, on ne le débloque PAS automatiquement,
      // il faut que l'utilisateur clique pour débloquer.
      if (this.computeBuyCost(1) <= this.money) {
        // Afficher éventuellement un indicateur visuel (ex: "Cliquez pour débloquer")
         this.unlockProduct();
      } else {
        console.log("Pas assez d'argent pour débloquer ce produit");
      }
      return;
    }
    // Si le produit n'est pas verrouillé, lancer la production si elle n'est pas déjà en cours
    if (!this.productionInProgress[this.product.id]) {
      this.startFabrication();
    }
  }

  // Méthode appelée lorsqu'on clique explicitement pour débloquer le produit
  unlockProduct(): void {
    // Ici, on appelle buyProduct pour acheter 1 unité et ainsi débloquer le produit.
    this.buyProduct(this.product.id);
    // Une fois l'achat réussi, le callback de buyProduct mettra à jour locked et on le marque comme débloqué manuellement.
  }

  // Démarre la production et la barre de progression
  startFabrication(): void {
    this.productionInProgress[this.product.id] = true;
    this.lastUpdateTimes[this.product.id] = Date.now();
    this.progressTime = 0; // Réinitialise la progression

    // Lancer la production côté serveur
    this.webservice.lancerProduction(this.webservice.user,this.product)
      .catch(reason => console.log("Erreur lors du lancement de production: " + reason));

    // Lance la boucle de calcul de la progression (toutes les 100ms)
    this.productionIntervals[this.product.id] = setInterval(() => {
      this.calcScore();
    }, 100);

    // Affiche la barre de progression
    this.progressInitialValue = this.product.timeleft; // Pour gérer le reload, par exemple
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
      const qt = 1; // Production d'une unité
      this.notifyProduction.emit({ p: this.product, qt: qt });

      // Si le manager est débloqué, réinitialiser la progression et continuer
      if (this.product.managerUnlocked) {
        // Réinitialise la progression pour relancer immédiatement la production
        this.progressTime = 0;
        // La boucle setInterval continue de tourner
      } else {
        // Sinon, arrêter la production après un court délai pour laisser afficher 100%
        setTimeout(() => {
          this.stopFabrication();
          this.stopProduction();
        }, 90); // Délai ajustable
      }
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
    console.log("Tentative d'achat: produit", productId, "quantité", quantite, "money", this.money);
    this.webservice.acheterQtProduit(this.webservice.user, productId, quantite)
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
          this.unlockedManually = true;
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
