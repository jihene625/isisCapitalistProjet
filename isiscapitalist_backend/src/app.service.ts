import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { origworld } from './origworld';
import { World, Product, Palier } from './graphql';

@Injectable()
export class AppService {
  readUserWorld(user: string): World {
    try {
      const data = fs.readFileSync(
        path.join(process.cwd(), 'userworlds/', user + '-world.json'),
      );
      return JSON.parse(data.toString());
    } catch (e: unknown) {
      console.log((e as Error).message);
      return origworld;
    }
  }
  saveWorld(user: string, world: World) {
    fs.writeFile(
      path.join(process.cwd(), 'userworlds/', user + '-world.json'),
      JSON.stringify(world),
      (err) => {
        if (err) {
          console.error(err);
          throw new Error(`Erreur d'écriture du monde coté serveur`);
        }
      },
    );
  }

  acheterQtProduit(user: string, id: number, quantite: number): Product {
    const world = this.readUserWorld(user);
    // Trouver le produit
    const product = world.products.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Le produit avec l'id ${id} n'existe pas`);
    }

    // Calculer le coût total de l'achat
    const prix =product.cout * ((1 - Math.pow(product.croissance, quantite)) / (1 - product.croissance));

    // Vérifier si l'utilisateur a assez d'argent
    if (world.money < prix) {
      throw new Error("Pas assez d'argent pour cet achat.");
    }

    // Augmenter la quantité du produit
    product.quantite += quantite;

    // Déduire l'argent du monde
    world.money -= prix;

    // Mettre à jour le coût d'achat du produit pour la prochaine unité
    product.cout = product.cout * Math.pow(product.croissance, quantite);

    // Sauvegarder le monde
    this.saveWorld(user, world);

    // Retourner le produit mis à jour
    return product;
  }

  lancerProductionProduit(user: string, id: number) : Product{
    const world = this.readUserWorld(user);

    // Trouver le produit correspondant à l'id
    const product = world.products.find((p) => p.id === id);

    // Si le produit n'existe pas, lever une erreur
    if (!product) {
      throw new Error(`Le produit avec l'id ${id} n'existe pas`);
    }

    // Démarrer la production en mettant à jour `timeleft`
    product.timeleft = product.vitesse;

    // Sauvegarder le monde mis à jour
    this.saveWorld(user, world);

    // Retourner le produit mis à jour
    return product;
  }

  engagerManager(user: string, name: string): Palier {
    const world = this.readUserWorld(user);

    // Trouver le manager correspondant
    const manager = world.managers.find((m) => m.name === name);
    if (!manager) {
      throw new Error(`Le manager avec le nom ${name} n'existe pas.`);
    }

    // Trouver le produit correspondant au manager
    const product = world.products.find((p) => p.id === manager.idcible);
    if (!product) {
      throw new Error(
        `Le produit avec l'id ${manager.idcible} de manager avec le nom ${name} n'existe pas.`,
      );
    }

    // Débloquer le manager et le produit
    manager.unlocked = true;
    product.managerUnlocked = true;

    // Sauvegarder l'état modifié du monde
    this.saveWorld(user, world);

    return manager;
  }
}
