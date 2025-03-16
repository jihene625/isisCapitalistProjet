// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebserviceService } from '../webservice.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';

  constructor(
    private webservice: WebserviceService,
    private router: Router, // Pour rediriger l'utilisateur après la connexion
    private authService: AuthService
  ) {}

  onEnter() {
    // Mettre à jour le nom de l'utilisateur dans le service
    this.webservice.user = this.username.trim();

    // Appeler getWorld pour récupérer (ou créer) le monde associé à cet utilisateur
    this.webservice.getWorld()
      .then(world => {
        console.log('Nouveau monde créé ou récupéré:', world);
        // Redirige vers la page principale du jeu par exemple
        this.router.navigate(['/game']);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération du world:', err);
      });
  }

  login(): void {
    if (this.username.trim().length > 0) {
      this.authService.setUsername(this.username);
      // Redirigez vers le composant principal (game) par exemple
      this.router.navigate(['/game']);
    }
  }
}
