import { Injectable } from '@angular/core';
import { Client, fetchExchange } from '@urql/core';
import { GET_WORLD } from './graphqlRequests';
import { World , Product , Palier} from './models/world.model';

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
}
