import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Palier, Product } from '../models/world.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebserviceService } from '../webservice.service';

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css']
})
export class ManagersComponent {
  // Titre de la section, ex. "MANAGERS"
  @Input() title: string = 'MANAGERS';
  // Liste des managers à afficher
  @Input() managers: Palier[] = [];
  // L'argent du joueur, pour activer/désactiver le bouton Hire
  @Input() worldMoney: number = 0;
  // Liste des produits, afin d'afficher le nom du produit ciblé par le manager
  @Input() products: Product[] = [];
  // Pour gérer une éventuelle autre ressource, par exemple des patients
  @Input() worldPatients: number = 0;
  @Input() username: string = '';

  // Événement émis quand on veut fermer l’interface
  @Output() close = new EventEmitter<void>();
  // Événement émis quand on clique sur "Hire" pour engager un manager
  @Output() hireManager = new EventEmitter<Palier>();

  constructor(private webservice: WebserviceService, private snackBar: MatSnackBar) {}

  // Vérifie si le joueur peut engager le manager
  canHireManager(m: Palier): boolean {
    return (this.worldMoney >= m.seuil) ;
  }

  // Méthode appelée quand on clique sur le bouton Hire
  onHire(m: Palier): void {
    if (!this.canHireManager(m)) {
      this.popMessage("Pas assez de ressources pour engager ce manager.");
      return;
    }
    // Appel de la mutation pour engager le manager en passant le nom de manager.
    // On utilise this.username pour transmettre le pseudo de l'utilisateur.
    this.webservice.engagerManager(this.username, m.name)
      .then(updatedManager => {
        // Si nécessaire, on peut ici appeler getWorld() pour mettre à jour l'état global
        return this.webservice.getWorld();
      })
      .then(newWorld => {
        // Émettre l'événement ou mettre à jour le monde dans le composant parent
        this.hireManager.emit(m);
        this.popMessage(`Engagé: ${m.name}`);
      })
      .catch(error => {
        console.error("Erreur lors de l'engagement du manager:", error);
        this.popMessage("Erreur lors de l'embauche");
      });
  }


  // Méthode pour fermer l'interface managers
  onClose(): void {
    this.close.emit();
  }

  // Renvoie le nom du service associé au manager en fonction de idcible
  getServiceName(idcible: number): string {
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

  // Affiche un message éphémère via MatSnackBar
  popMessage(message: string): void {
    this.snackBar.open(message, "", { duration: 2000 });
  }
}
