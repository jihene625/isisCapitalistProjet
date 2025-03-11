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
    const prix = product.cout * ((1 - Math.pow(product.croissance, quantite)) / (1 - product.croissance));
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
    // Vérification des paliers d'unlock
    this.checkUnlocks(world, product);

    this.saveWorld(user, world);
    // Retourner le produit mis à jour
    return product;
  }

  lancerProductionProduit(user: string, id: number): Product {
    const world = this.readUserWorld(user);
    this.updateWorld(world);

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
    this.updateWorld(world);

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

    if (world.money < manager.seuil) {
      throw new Error(`Pas assez d'argent pour embaucher ${name}.`);
    }

    // Débloquer le manager et le produit
    manager.unlocked = true;
    product.managerUnlocked = true;
    world.money -= manager.seuil;

    // Sauvegarder l'état modifié du monde
    this.saveWorld(user, world);

    return manager;
  }

  checkUnlocks(world: World, product: Product) {
    this.checkProductUnlocks(world, product);
    this.checkAllUnlocks(world);
  }

  /**
   * Vérifie si un produit a atteint un seuil de palier et applique le bonus si nécessaire.
   */
  checkProductUnlocks(world: World, product: Product) {
    product.paliers.forEach(palier => {
      if (!palier.unlocked && product.quantite >= palier.seuil) {
        palier.unlocked = true;
        this.applyBonus(world, palier);
      }
    });
  }

  /**
   * Vérifie si un allunlock doit être activé lorsque tous les produits atteignent un seuil donné.
   */
  checkAllUnlocks(world: World) {
    world.allunlocks.forEach(palier => {
      if (!palier.unlocked && world.products.every(p => p.quantite >= palier.seuil)) {
        palier.unlocked = true;
        this.applyBonus(world, palier);
      }
    });
  }

  applyBonus(world: World, palier: Palier) {
    if (palier.idcible > 0) {
      let product = world.products.find(p => p.id === palier.idcible);
      if (product) {
        this.applyBonusForProduct(world, product, palier);
      }
    } else if (palier.idcible === 0) {
      world.products.forEach(product => {
        this.applyBonusForProduct(world, product, palier);
      });
    }
  }

  applyBonusForProduct(world: World, product: Product, palier: Palier) {
    switch (palier.typeratio) {
      case "gain":
        product.revenu *= palier.ratio;
        break;
      case "vitesse":
        product.vitesse = Math.max(1, Math.floor(product.vitesse / palier.ratio)); // Évite vitesse = 0
        break;
      case "ange":
        world.angelbonus += palier.ratio;
        break;
    }
  }

  acheterCashUpgrade(user: string, name: string): Palier {
    let world = this.readUserWorld(user);
    this.updateWorld(world);

    let upgrade = world.upgrades.find((u) => u.name === name);
    if (!upgrade) {
      throw new Error(`L'upgrade ${name} n'existe pas`);
    }
    if (world.money < upgrade.seuil) {
      throw new Error(`Pas assez d'argent pour acheter l'upgrade ${name}`);
    }
    if (upgrade.unlocked) {
      throw new Error(`L'upgrade ${name} est déjà débloqué`);
    }

    world.money -= upgrade.seuil;
    upgrade.unlocked = true;
    this.applyBonus(world, upgrade);

    this.saveWorld(user, world);

    return upgrade;
  }

  acheterAngelUpgrade(user: string, name: string): Palier {
    let world = this.readUserWorld(user);
    this.updateWorld(world);

    let upgrade = world.angelupgrades.find((u) => u.name === name);
    if (!upgrade) {
      throw new Error(`L'upgrade avec l'id ${name} n'existe pas`);
    }
    if (world.activeangels < upgrade.seuil) {
      throw new Error(`Pas assez d'anges pour acheter l'upgrade ${name}`);
    }
    if (upgrade.unlocked) {
      throw new Error(`L'upgrade ${name} est déjà débloqué`);
    }

    world.activeangels -= upgrade.seuil;
    upgrade.unlocked = true;
    this.applyBonus(world, upgrade);

    this.saveWorld(user, world);

    return upgrade;
  }

  worldReset(user: string): World {
    let world = this.readUserWorld(user);
    this.updateWorld(world);

    // Calculer le nombre d’anges supplémentaires gagnés
    const additionalAngels = Math.floor(150 * Math.sqrt(world.score / Math.pow(10, 5))) - world.totalangels;
    world.totalangels += additionalAngels;
    world.activeangels += additionalAngels;

    // Conserver le score et les propriétés des anges
    const score = world.score;
    const totalangels = world.totalangels;
    const activeangels = world.activeangels;

    // Réinitialiser le monde à son état initial
    world = JSON.parse(JSON.stringify(origworld));
    world.score = score;
    world.totalangels = totalangels;
    world.activeangels = activeangels;

    this.saveWorld(user, world);

    return world;
  }

  updateWorld(world: World) {
    const currentTime = Date.now();
    let elapsedTime = currentTime - world.lastupdate;

    if (elapsedTime <= 0) {
      return; // Rien à mettre à jour si le temps n'a pas avancé
    }

    world.products.forEach((product) => {
      if (product.quantite > 0) {
        if (product.managerUnlocked) {
          // Gestion automatique avec un manager
          if (product.timeleft > 0) {
            elapsedTime += product.vitesse - product.timeleft;
          }

          const nbProductions = Math.floor(elapsedTime / product.vitesse);
          product.timeleft = product.vitesse - (elapsedTime % product.vitesse);

          if (nbProductions > 0) {
            const revenue = nbProductions * product.revenu * product.quantite * (1 + world.activeangels * (world.angelbonus / 100));
            world.money += revenue;
            world.score += revenue;
          }
        } else {
          // Gestion manuelle (sans manager)
          if (product.timeleft > 0) {
            if (product.timeleft <= elapsedTime) {
              const revenue = product.revenu * product.quantite * (1 + world.activeangels * (world.angelbonus / 100));
              world.money += revenue;
              world.score += revenue;
              product.timeleft = 0;
            } else {
              product.timeleft -= elapsedTime;
            }
          }
        }
      }
    });

    world.lastupdate = currentTime;
  }

}
