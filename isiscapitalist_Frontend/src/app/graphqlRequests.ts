import { gql } from '@urql/core';

export const GET_WORLD = gql`
  query getWorld($user: String!) {
    getWorld(user: $user) {
      name
      angelbonus
      logo
      money
      score
      totalangels
      lastupdate
      products {
        id
        name
        logo
        cout
        croissance
        revenu
        vitesse
        quantite
        timeleft
        managerUnlocked
        paliers {
          name
          logo
          seuil
          idcible
          ratio
          typeratio
          unlocked
        }
      }
      allunlocks {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      upgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      angelupgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      managers {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
    }
  }
`;

export const ACHETER_QT_PRODUIT_MUTATION = gql`
  mutation acheterQtProduit($user: String!, $id: Int!, $quantite: Int!) {
    acheterQtProduit(user: $user, id: $id, quantite: $quantite) {
      id
      name
      logo
      cout
      croissance
      revenu
      vitesse
      quantite
      timeleft
      managerUnlocked
      paliers {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
    }
  }
`;

export const ENGAGER_MANAGER = gql`
  mutation engagerManager($user: String!, $name: String!) {
    engagerManager(user: $user, name: $name) {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
  }
`;

export const LANCER_PRODUCTION = gql`
  mutation lancerProductionProduit($user:String!,$id: Int!) {
    lancerProductionProduit(user:$user,id: $id) {
      id
      timeleft
    }
  }
`;

// Mutation pour acheter une upgrade en cash
export const ACHETER_CASH_UPGRADE = gql`
  mutation acheterCashUpgrade($user: String!, $name: String!) {
    acheterCashUpgrade(user: $user, name: $name) {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
  }
`;

// Mutation pour acheter une upgrade en patients (ou angels)
export const ACHETER_ANGEL_UPGRADE = gql`
  mutation acheterAngelUpgrade($user: String!, $name: String!) {
    acheterAngelUpgrade(user: $user, name: $name) {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
  }
`;

// (Optionnel) Mutation pour réinitialiser le monde
export const RESET_WORLD = gql`
  mutation resetWorld($user: String!) {
    resetWorld(user: $user) {
      name
      logo
      money
      score
      totalangels
      activeangels
      angelbonus
      lastupdate
      products {
        id
        name
        logo
        cout
        croissance
        revenu
        vitesse
        quantite
        timeleft
        managerUnlocked
        paliers {
          name
          logo
          seuil
          idcible
          ratio
          typeratio
          unlocked
        }
      }
      allunlocks {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      upgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      angelupgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      managers {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
    }
  }
`;


