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
    // specific unlocks
    this.checkProductUnlocks(world, product);

    // allunlocks
    this.checkAllUnlocks(world);
  }

  checkProductUnlocks(world: World, product: Product) {
    product.paliers.forEach(palier => {
      if (!palier.unlocked && product.quantite >= palier.seuil) {
        palier.unlocked = true;
        this.applyBonus(world, palier);
      }
    });
  }

  checkAllUnlocks(world: World) {
    let productQuantityTotal = 0;
    world.products.forEach(product => {
      productQuantityTotal += product.quantite;
    })

    world.allunlocks.forEach(palier => {
      if (!palier.unlocked && productQuantityTotal >= palier.seuil) {
        palier.unlocked = true;
        this.applyBonus(world, palier);
      }
    });

  }

  applyBonus(world: World, palier: Palier) {
    if (palier.idcible > 0) {
      let product = world.products.find((p) => p.id === palier.idcible);
      if (!product) {
        throw new Error(`Le produit avec l'id ${palier.idcible} n'existe pas`);
      }
      this.applyBonusForProduct(world, product, palier);
    }

    if (palier.idcible === 0) {
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
        product.vitesse = Math.round(product.vitesse / palier.ratio);
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

    // Calculate additional angels gained
    const additionalAngels = Math.floor(150 * Math.sqrt(world.score / Math.pow(10, 5))) - world.totalangels;
    world.totalangels += additionalAngels;
    world.activeangels += additionalAngels;

    // Preserve score and angel properties
    const score = world.score;
    const totalangels = world.totalangels;
    const activeangels = world.activeangels;

    // Reset world to its initial state
    world = <World>origworld;
    world.score = score;
    world.totalangels = totalangels;
    world.activeangels = activeangels;

    this.saveWorld(user, world);

    return world;
  }



  updateWorld(world: World) {
    const currentTime = Date.now();
    const elapseTime = currentTime - world.lastupdate;
    world.lastupdate = currentTime;


    world.products.forEach((product) => {
      if (product.managerUnlocked == false) {
        if (product.timeleft > 0) {
          if (product.timeleft <= elapseTime) {
            world.money += product.revenu * product.quantite * (1 + world.activeangels * (world.angelbonus / 100));
            world.score += product.revenu * product.quantite * (1 + world.activeangels * (world.angelbonus / 100));
            product.timeleft = 0;
          } else {
            product.timeleft -= elapseTime;
          }
        }
      }
      else {
        let nbProduction = 1 + Math.floor((elapseTime - product.timeleft) / product.vitesse);
        console.log(nbProduction)
        const remainingTime = (elapseTime - product.timeleft) % product.vitesse;
        console.log(remainingTime)
        world.money += nbProduction * product.revenu * product.quantite * (1 + world.activeangels * (world.angelbonus / 100));
        world.score += nbProduction * product.revenu * product.quantite * (1 + world.activeangels * (world.angelbonus / 100));
        product.timeleft = product.vitesse - remainingTime;

      }

    });


  }



}
