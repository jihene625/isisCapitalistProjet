import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Palier, Product } from '../models/world.model';

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css']
})
export class ManagersComponent {
  // Liste des managers à afficher (les managers du world)
  @Input() managers: Palier[] = [];
  // L'argent du joueur, pour activer/désactiver le bouton Hire
  @Input() worldMoney: number = 0;
  // Liste des produits, afin d'afficher le nom du produit ciblé
  @Input() products: Product[] = [];

  // Événement à émettre pour engager un manager
  @Output() hireManager: EventEmitter<Palier> = new EventEmitter();
  // Événement pour fermer la modal
  @Output() close: EventEmitter<void> = new EventEmitter();

  // Renvoie le nom du produit ciblé par le manager
  getProductName(idcible: number): string {
    if (idcible === 0) return 'Tous les produits';
    const prod = this.products.find(p => p.id === idcible);
    return prod ? prod.name : 'Produit inconnu';
  }

  // Appelé lors du clic sur le bouton Hire
  onHire(manager: Palier): void {
    if (this.worldMoney >= manager.seuil) {
      this.hireManager.emit(manager);
    } else {
      console.log("Argent insuffisant pour engager ce manager.");
    }
  }

  // Ferme la modal
  onClose(): void {
    this.close.emit();
  }
}
