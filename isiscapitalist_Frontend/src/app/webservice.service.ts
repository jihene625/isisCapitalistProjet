import { Injectable } from '@angular/core';
import { Client, fetchExchange } from '@urql/core';
import { GET_WORLD } from './graphqlrequests';
import { World } from './models/world.model';

@Injectable({
  providedIn: 'root',
})
export class WebService {
  server = 'http://localhost:4000/graphql'; // URL de l'API GraphQL
  user = 'toto'; // Nom temporaire du joueur

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
}
