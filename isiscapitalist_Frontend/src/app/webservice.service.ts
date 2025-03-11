import { Injectable } from '@angular/core';
import { Client, fetchExchange } from '@urql/core';
import { GET_WORLD, ACHETER_QT_PRODUIT_MUTATION } from './graphqlRequests';
import { World, Product, Palier } from './models/world.model';

@Injectable({
  providedIn: 'root',
})
export class WebserviceService {
  server = 'http://localhost:3000/graphql'; // URL de l'API GraphQL (Port:3000)
  user = 'amine'; // Nom temporaire du joueur

  createClient(): Client {
    return new Client({
      url: this.server,
      exchanges: [fetchExchange],
    });
  }

  getWorld(): Promise<World> {
    return this.createClient()
      .query(GET_WORLD, { user: this.user })
      .toPromise()
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data.getWorld;
      });
  }

  // Méthode d'achat du produit
  acheterQtProduit(user: string, id: number, quantite: number): Promise<Product> {
    return this.createClient()
      .mutation(ACHETER_QT_PRODUIT_MUTATION, { user, id, quantite })
      .toPromise()
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        // On s'assure que la mutation retourne bien un produit
        return response.data.acheterQtProduit as Product;
      });
  }
}
