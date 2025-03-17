import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Palier, World} from '../models/world.model';
import { WebserviceService } from '../webservice.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
@Component({
  selector: 'app-upgrades',
  standalone: true,
  imports: [CommonModule,
  MatSnackBarModule],
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

  @Output() worldUpdated: EventEmitter<World> = new EventEmitter();

  /** Onglet sélectionné : 'cash' ou 'patient' */
  selectedTab: 'cash' | 'patient' = 'cash';
  private username!: string;

  constructor(private webservice: WebserviceService, private snackBar: MatSnackBar) {}

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

  getProductName(idcible: number): string {
    switch (idcible) {
      case 1: return 'Radiologie';
      case 2: return 'Chirurgie';
      case 3: return 'Soins';
      case 4: return 'Laboratoire';
      case 5: return 'Urgence';
      case 6: return 'Pharmacie';
      default: return 'Service inconnu';
    }
  }

  /** Vérifie si on peut acheter un upgrade donné */
  canBuy(up: Palier): boolean {
    if (this.selectedTab === 'cash') {
      return this.userMoney >= up.seuil;
    } else {
      return this.userPatients >= up.seuil;
    }
  }

  /** Appelé quand on clique sur le bouton BUY */
  onBuy(up: Palier): void {
    if (!this.canBuy(up)) {
      this.popMessage("Pas assez de ressources pour cet upgrade.");
      return;
    }

    if (this.selectedTab === 'cash') {
      this.webservice.acheterCashUpgrade(this.username, up.name)
        .then(updatedUpgrade => {
          this.popMessage(`Upgrade ${up.name} purchased successfully`);
          return this.webservice.getWorld();
        })
        .then((newWorld: World) => {
          this.worldUpdated.emit(newWorld);
        })
        .catch(err => {
          console.error("Error buying cash upgrade", err);
          this.popMessage("Error buying cash upgrade");
        });
    } else {
      this.webservice.acheterAngelUpgrade(this.username, up.name)
        .then(updatedUpgrade => {
          this.popMessage(`Upgrade ${up.name} purchased successfully`);
          return this.webservice.getWorld();
        })
        .then((newWorld: World) => {
          this.worldUpdated.emit(newWorld);
        })
        .catch(err => {
          console.error("Error buying patient upgrade", err);
          this.popMessage("Error buying patient upgrade");
        });
    }
  }


  popMessage(message: string): void {
    this.snackBar.open(message, "", { duration: 2000 });
  }
  /** Ferme la fenêtre */
  onClose() {
    this.close.emit();
  }
}
