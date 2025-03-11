import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Palier } from '../models/world.model';

@Component({
  selector: 'app-unlock-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unlock-details.component.html',
  styleUrls: ['./unlock-details.component.css']
})
export class UnlockDetailsComponent {
  // Nom de la section, ex. "RADIOLOGIE UNLOCKS" ou "ALL PRODUCTS UNLOCKS"
  @Input() title: string = '';

  // Liste des paliers à afficher (ceux du produit ou d’un allunlock)
  @Input() paliers: Palier[] = [];

  // Pour suivre quel unlock est sélectionné
  selectedUnlock: Palier | null = null;

  // Méthode pour sélectionner un unlock
  selectUnlock(p: Palier): void {
    // Si on clique sur le même unlock, on le désélectionne (optionnel)
    if (this.selectedUnlock === p) {
      this.selectedUnlock = null;
    } else {
      this.selectedUnlock = p;
    }
  }

  // Exemple : si vous voulez afficher "1/4" (ex. 1 unlock débloqué / 4)
  get unlockedCount(): number {
    return this.paliers.filter(p => p.unlocked).length;
  }
  get totalCount(): number {
    return this.paliers.length;
  }

  // Événement pour fermer le détail
  @Output() close = new EventEmitter<void>();
  closeDetails() {
    this.close.emit();
  }

  // Méthode pour afficher un texte décrivant l’effet : ex. "Scanner x2" => "speed doubled"
  // ou "profit x3"
  formatPalierMessage(p: Palier): string {
    // Exemple: p.seuil=25, p.name="Le rayon fait le boulot!", p.typeratio="vitesse"
    // => "25 scanner - profit speed of scanner doubled"
    // S'il s'agit d'un produit particulier, on peut mapper idcible => "Scanner"
    let productName = this.resolveProductName(p.idcible);

    // On prépare la partie "25 scanner"
    let frontPart = `${p.seuil} ${productName}`;

    // On prépare la partie " - profit speed of scanner doubled" selon typeratio
    let effectPart = '';
    switch (p.typeratio) {
      case 'vitesse':
        effectPart = 'production speed doubled';
        break;
      case 'gain':
        effectPart = 'profit doubled';
        break;
      case 'ange':
        effectPart = 'angel bonus multiplied';
        break;
      default:
        effectPart = 'bonus applied';
        break;
    }

    return `${frontPart} - ${effectPart}`;
  }
  resolveProductName(id: number): string {
    if (id === 0) return 'All Products';
    if (id === 1) return 'Scanner';
    if (id === 2) return 'Table d\'opération';
    if (id === 3) return 'Lit médicalisé';
    if (id === 4) return 'Centrifugeuse';
    if (id === 5) return 'Défibrillateur';
    if (id === 6) return 'robot de préparation';
    return 'Produit inconnu';
  }
}
