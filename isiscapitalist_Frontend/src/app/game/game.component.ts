import { Component, OnInit } from '@angular/core';
import { WebserviceService } from '../webservice.service';
import { World } from '../models/world.model';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-game',
  standalone: true, // si tu utilises les standalone components
  templateUrl: './game.component.html',
  imports: [
    NgForOf,
    NgIf,
    DecimalPipe,
    CommonModule
  ],
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  world: World | null = null;

  constructor(private webservice: WebserviceService) {}

  ngOnInit(): void {
    // Récupère le "World" (univers du joueur) depuis le backend
    this.webservice.getWorld()
      .then(w => this.world = w)
      .catch(err => console.error('Erreur lors de la récupération du monde', err));
  }

  // Exemple de méthodes si tu veux acheter ou lancer la production
  buyProduct(productId: number, quantite: number = 1) {
    // Appeler la mutation GraphQL correspondante dans WebserviceService
  }

  launchProduction(productId: number) {
    // Idem, appeler la mutation correspondante
  }
}
