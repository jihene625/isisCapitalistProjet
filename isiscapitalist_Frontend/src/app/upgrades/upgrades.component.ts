import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Palier } from '../models/world.model';

@Component({
  selector: 'app-upgrades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upgrades.component.html',
  styleUrls: ['./upgrades.component.css']
})
export class UpgradesComponent {

  /** Titre de la fenêtre (ex: "UPGRADES") */
  @Input() title: string = 'UPGRADES';

  /** Liste d'upgrades "cash" */
  @Input() cashUpgrades: Palier[] = [];

  /** Liste d'upgrades "patient" (ou "angel", etc.) */
  @Input() patientUpgrades: Palier[] = [];

  /** Argent du joueur pour savoir si on peut acheter */
  @Input() userMoney: number = 0;

  /** Ressource "patients" si vous en gérez une, sinon enlevez ce champ */
  @Input() userPatients: number = 0;

  /** Événement pour fermer la fenêtre Upgrades */
  @Output() close = new EventEmitter<void>();

  /** Événement émis quand on clique sur "BUY!" */
  @Output() buyUpgrade = new EventEmitter<Palier>();

  /** Onglet sélectionné : 'cash' ou 'patient' */
  selectedTab: 'cash' | 'patient' = 'cash';

  /** On bascule d'onglet quand on clique sur un bouton */
  onSelectTab(tab: 'cash' | 'patient') {
    this.selectedTab = tab;
  }

  /** Liste des upgrades à afficher en fonction de l'onglet sélectionné */
  get displayedUpgrades(): Palier[] {
    if (this.selectedTab === 'cash') {
      return this.cashUpgrades;
    } else {
      return this.patientUpgrades;
    }
  }

  /** Vérifie si on peut acheter un upgrade donné */
  canBuy(up: Palier): boolean {
    // Par exemple, on compare à userMoney, ou à userPatients selon la logique
    // Ici, on suppose que l'achat se fait en argent :
    return this.userMoney >= up.seuil;
  }

  /** Appelé quand on clique sur le bouton BUY */
  onBuy(up: Palier) {
    if (!this.canBuy(up)) {
      // Optionnel : vous pouvez afficher un message
      console.log("Pas assez d'argent (ou de patients) pour cet upgrade.");
      return;
    }
    // On émet l'événement pour que le parent fasse la mutation GraphQL
    this.buyUpgrade.emit(up);
  }

  /** Ferme la fenêtre */
  onClose() {
    this.close.emit();
  }
}
