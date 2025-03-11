import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, Palier } from '../models/world.model';
@Component({
  selector: 'app-unlocks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unlocks.component.html',
  styleUrls: ['./unlocks.component.css']
})
export class UnlocksComponent {
  // Liste de tous les produits
  @Input() products: Product[] = [];
  @Input() allunlocks: Palier[] = []; // si vous voulez gérer le allunlock


  // Méthode pour associer l'id d'un produit à un nom de service
  getServiceName(p: Product): string {
    switch (p.id) {
      case 1: return 'Radiologie';
      case 2: return 'Chirurgie';
      case 3: return 'Soins';
      case 4: return 'Laboratoire';
      case 5: return 'Urgence';
      case 6: return 'Pharmacie';
      default: return 'Service inconnu';
    }
  }

  // Détermine l’affichage du « x25 », « x50 »… selon la quantité
  getThresholdDisplay(p: Product): string {
    if (p.quantite < 25) return 'x25';
    else if (p.quantite < 50) return 'x50';
    else if (p.quantite < 75) return 'x75';
    else if (p.quantite < 100) return 'x100';
    return 'max';
  }

  // Événement si on clique sur une carte d’un produit
  @Output() productClicked = new EventEmitter<Product>();
  onCardClick(p: Product) {
    console.log('onCardClick() in UnlocksComponent', p); // debug
    this.productClicked.emit(p);
  }

  @Output() close = new EventEmitter<void>();
  closeUnlocks() {
    this.close.emit();
  }

  // Si vous voulez gérer le clic sur la carte "Allunlock"
  @Output() allunlockClicked = new EventEmitter<void>();
  onAllunlockClick() {
    console.log("Clicked the Allunlock card");
    this.allunlockClicked.emit();
  }
}
