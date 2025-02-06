import { origworld } from './origworld';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import { Palier } from './graphql';
@Resolver('World')
export class GraphQlResolver {
constructor(private service: AppService) {}
@Query()
async getWorld(@Args('user') user: string) {
const world = this.service.readUserWorld(user);
this.service.saveWorld(user, world);
return world
}
@Mutation()
async acheterQtProduit(
@Args('user') user: string,
@Args('id') id: number,
@Args('quantite') quantite: number,
) {
  const world = this.service.readUserWorld(user);
  // Trouver le produit
  const product = world.products.find((p) => p.id === id);
  if(!product){
      throw new Error(`Le produit avec l'id ${id} n'existe pas`)
  }

   // Calculer le coût total de l'achat
     let totalCost = 0;
     let currentCost = product.cout;

     for (let i = 0; i < quantite; i++) {
       totalCost += currentCost;
       currentCost *= product.croissance; // Appliquer l'augmentation du coût pour chaque unité
       currentCost=Math.round(currentCost*100)/100;
     }

     // Vérifier si l'utilisateur a assez d'argent
     if (world.money < totalCost) {
       throw new Error("Pas assez d'argent pour cet achat.");
     }

     // Augmenter la quantité du produit
     product.quantite += quantite;

     // Déduire l'argent du monde
     world.money -= totalCost;

     // Mettre à jour le coût d'achat du produit pour la prochaine unité
     product.cout = currentCost;

     // Sauvegarder le monde
     this.service.saveWorld(user, world);

     // Retourner le produit mis à jour
     return product;
   }

}
