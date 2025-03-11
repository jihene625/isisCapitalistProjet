import { Component, OnInit } from '@angular/core';
import { WebserviceService } from '../webservice.service';
import { World, Product, Palier } from '../models/world.model';
import { DecimalPipe, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.component';
import { UnlocksComponent } from '../unlocks/unlocks.component';
import { UnlockDetailsComponent } from '../unlock-details/unlock-details.component';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  imports: [
    NgIf,
    DecimalPipe,
    CommonModule,
    ProductComponent,
    UnlocksComponent,
    UnlockDetailsComponent
  ],
})
export class GameComponent implements OnInit {
  world: World | null = null;
  qtmulti: string = 'x1';  // Valeur initiale du multiplicateur
  showUnlocks = false;  // Contrôle l’affichage de l’interface Unlocks
  showProductDetail = false;     // vrai => on affiche <app-unlock-details>
  detailTitle = '';
  selectedProductPaliers: Palier[] = [];
  constructor(private webservice: WebserviceService) {}

  ngOnInit(): void {
    this.webservice.getWorld()
      .then(w => this.world = w)
      .catch(err => console.error('Erreur lors de la récupération du monde', err));
  }

  // Permet de faire tourner le multiplicateur dans le cycle : x1 -> x10 -> x100 -> Max -> x1, ...
  toggleQtmulti(): void {
    if (this.qtmulti === 'x1') {
      this.qtmulti = 'x10';
    } else if (this.qtmulti === 'x10') {
      this.qtmulti = 'x100';
    } else if (this.qtmulti === 'x100') {
      this.qtmulti = 'Max';
    } else {
      this.qtmulti = 'x1';
    }
  }

  toggleUnlocks(): void {
    this.showUnlocks = !this.showUnlocks;
  }

  // Si vous voulez réagir quand on clique sur un produit dans l'unlocks
  onUnlockProductClicked(product: Product) {
    console.log('onUnlockProductClicked() in GameComponent', product); // debug
    // On ferme l'interface Unlocks
    this.showUnlocks = false;
    // On ouvre l'interface détail
    this.detailTitle = product.name.toUpperCase() + ' UNLOCKS';
    this.selectedProductPaliers = product.paliers;
    this.showProductDetail = true;
    console.log('showProductDetail =>', this.showProductDetail);
  }

  onAllunlockClicked() {
    // On ferme l'interface Unlocks
    this.showUnlocks = false;
    // On ouvre l'interface détail
    this.detailTitle = 'ALL PRODUCTS UNLOCKS';
    this.selectedProductPaliers = this.world?.allunlocks || [];
    this.showProductDetail = true;
  }

  onCloseDetails() {
    this.showProductDetail = false;
    this.showUnlocks = true;
  }

  onUnlocksClose() {
    console.log('onUnlocksClose() called in GameComponent');
    this.showUnlocks = false;
  }


  // Lorsqu'un produit termine sa production, on met à jour l'argent et le score
  onProductionDone(message: { p: Product; qt: number }): void {
    if (this.world) {
      const gain = message.qt * message.p.revenu;
      this.world.money += gain;
      this.world.score += gain;
      console.log(`Produit ${message.p.name} produit ${message.qt} fois, gain: ${gain}`);
    }
  }

  // Met à jour le world après un achat
  onWorldUpdate(newWorld: World): void {
    this.world = newWorld;
    console.log("World mis à jour :", newWorld);
  }

  // Permet au composant produit de notifier le coût total pour un achat,
  // afin que le parent puisse décrémenter l'argent et mettre à jour le score.
  onBuy(totalCost: number): void {
    if (this.world) {
      this.world.money -= totalCost;
      this.world.score += totalCost;
      console.log("Coût total déduit :", totalCost);
    }
  }
}
