import { Component, OnInit } from '@angular/core';
import { WebserviceService } from '../webservice.service';
import { World } from '../models/world.model';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true, // si tu utilises les standalone components
  templateUrl: './product.component.html',
  imports: [
    NgForOf,
    NgIf,
    DecimalPipe,
    CommonModule
  ],
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
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
  formatTime(time: number): string {
    // Convertir le temps en secondes
    const totalSeconds = Math.floor(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Formater avec des zéros initiaux pour obtenir toujours 2 chiffres
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    return `${hoursStr}.${minutesStr}.${secondsStr}`;
  }
}

