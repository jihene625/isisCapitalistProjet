import { Injectable } from '@angular/core';
import { Client, fetchExchange } from '@urql/core';
import {
  GET_WORLD,
  ACHETER_QT_PRODUIT_MUTATION,
  LANCER_PRODUCTION,
  RESET_WORLD,
  ACHETER_ANGEL_UPGRADE, ACHETER_CASH_UPGRADE
} from './graphqlRequests';
import { World, Product, Palier } from './models/world.model';
import { ENGAGER_MANAGER } from './graphqlRequests';

@Injectable({
  providedIn: 'root',
})
export class WebserviceService {
  server = 'http://localhost:3000/graphql'; // URL de l'API GraphQL (Port:3000)
  user = ''; // Nom temporaire du joueur

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
    console.log("Variables envoyées:", { user, id, quantite });
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

  // Méthode pour engager un manager
  engagerManager(user: string, name: string): Promise<Palier> {
    return this.createClient()
      .mutation(ENGAGER_MANAGER, { user, name })
      .toPromise()
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        // Assurez-vous que la mutation retourne bien un manager (de type Palier)
        return response.data.engagerManager as Palier;
      });
  }

  lancerProduction(product: Product): Promise<Product> {
    return this.createClient()
      .mutation(LANCER_PRODUCTION, { id: product.id })
      .toPromise()
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        // On s'assure que la mutation retourne bien le produit mis à jour
        return response.data.lancerProductionProduit as Product;
      });
  }

  acheterCashUpgrade(user: string, name: string): Promise<Palier> {
    return this.createClient()
      .mutation(ACHETER_CASH_UPGRADE, { user, name })
      .toPromise()
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data.acheterCashUpgrade as Palier;
      });
  }

  acheterAngelUpgrade(user: string, name: string): Promise<Palier> {
    return this.createClient()
      .mutation(ACHETER_ANGEL_UPGRADE, { user, name })
      .toPromise()
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data.acheterAngelUpgrade as Palier;
      });
  }

  resetWorld(user: string): Promise<World> {
    return this.createClient()
      .mutation(RESET_WORLD, { user })
      .toPromise()
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data.resetWorld as World;
      });
  }
}
