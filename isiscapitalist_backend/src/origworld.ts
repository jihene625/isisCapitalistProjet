import { RatioType } from './graphql';

export const origworld = {
  name: 'A Nice World 2',
  logo: 'background.png',
  money: 0,
  score: 0,
  totalangels: 0,
  activeangels: 0,
  angelbonus: 2,
  lastupdate: 0,
  products: [
    {
      id: 1,
      name: 'Scanner',
      logo: 'scanner.png',
      cout: 4,
      croissance: 1.07,
      revenu: 1,
      vitesse: 500,
      quantite: 1,
      timeleft: 0,
      managerUnlocked: false,
      paliers: [
        {
          name: 'Le rayon fait le boulot !',
          logo: 'scanner.png',
          seuil: 25,
          idcible: 1,
          ratio: 2,
          typeratio: RatioType.vitesse,
          unlocked: false,
        },
        {
          name: "Zoom Zoom Scanner !",
          logo: 'scanner.png',
          seuil: 50,
          idcible: 1,
          ratio: 2,
          typeratio: RatioType.vitesse,
          unlocked: false,
        },
        {
          name: "T'as vu mes os ?",
          logo: 'scanner.png',
          seuil: 100,
          idcible: 1,
          ratio: 2,
          typeratio: RatioType.vitesse,
          unlocked: false,
        },
        {
          name: "Posez-vous là, ça va flasher !",
          logo: 'scanner.png',
          seuil: 200,
          idcible: 1,
          ratio: 3,
          typeratio: RatioType.gain,
          unlocked: false,
        },
      ],
    },
    {
      id: 2,
      name: 'Table d\'opération',
      logo: 'operation.png',
      cout: 60,
      croissance: 1.15,
      revenu: 60,
      vitesse: 3000,
      quantite: 0,
      timeleft: 0,
      managerUnlocked: false,
      paliers: [
        {
          name: 'Bloc 2.0 !',
          logo: 'icones/operation.png',
          seuil: 25,
          idcible: 2,
          ratio: 2,
          typeratio: RatioType.vitesse,
          unlocked: false,
        },
        {
          name: 'Pas de panique ! ',
          logo: 'icones/operation.png',
          seuil: 50,
          idcible: 2,
          ratio: 2,
          typeratio: RatioType.vitesse,
          unlocked: false,
        },
        {
          name: 'Chirurgie express ! ',
          logo: 'icones/operation.png',
          seuil: 100,
          idcible: 2,
          ratio: 2,
          typeratio: RatioType.vitesse,
          unlocked: false,
        },
        {
          name: 'Main de maître ! ',
          logo: 'icones/operation.png',
          seuil: 200,
          idcible: 2,
          ratio: 3,
          typeratio: RatioType.gain,
          unlocked: false,
        },
      ],
    },
    {
          id: 3,
          name: 'Lit médicalisé',
          logo: 'icones/lit medicalisé.png',
          cout: 720,
          croissance: 1.14,
          revenu: 540,
          vitesse: 6000,
          quantite: 1,
          timeleft: 0,
          managerUnlocked: false,
          paliers: [
            {
              name: 'Réveil zen !',
              logo: 'icones/lit medicalisé.png',
              seuil: 25,
              idcible: 3,
              ratio: 2,
              typeratio: RatioType.vitesse,
              unlocked: false,
            },
            {
              name: "Confort suprême !",
              logo: 'icones/lit medicalisé.png',
              seuil: 50,
              idcible: 3,
              ratio: 2,
              typeratio: RatioType.vitesse,
              unlocked: false,
            },
            {
              name: "Matelas magique !",
              logo: 'icones/lit medicalisé.png',
              seuil: 100,
              idcible: 3,
              ratio: 2,
              typeratio: RatioType.vitesse,
              unlocked: false,
            },
            {
              name: "Soin royal !",
              logo: 'icones/lit medicalisé.png',
              seuil: 200,
              idcible: 3,
              ratio: 2,
              typeratio: RatioType.gain,
              unlocked: false,
            },
          ],
        },
        {
              id: 4,
              name: 'Centrifugeuse',
              logo: 'icones/laboratoire.png',
              cout: 8640,
              croissance: 1.13,
              revenu: 4320,
              vitesse: 12000,
              quantite: 1,
              timeleft: 0,
              managerUnlocked: false,
              paliers: [
                {
                  name: 'Précision atomique !',
                  logo: 'icones/laboratoire.png',
                  seuil: 25,
                  idcible: 4,
                  ratio: 2,
                  typeratio: RatioType.vitesse,
                  unlocked: false,
                },
                {
                  name: "Fluides en folie !",
                  logo: 'icones/laboratoire.png',
                  seuil: 50,
                  idcible: 4,
                  ratio: 2,
                  typeratio: RatioType.vitesse,
                  unlocked: false,
                },
                {
                  name: "Mix master !",
                  logo: 'icones/laboratoire.png',
                  seuil: 100,
                  idcible: 4,
                  ratio: 2,
                  typeratio: RatioType.vitesse,
                  unlocked: false,
                },
                {
                  name: "Tourne à fond !",
                  logo: 'icones/laboratoire.png',
                  seuil: 200,
                  idcible: 4,
                  ratio: 3,
                  typeratio: RatioType.gain,
                  unlocked: false,
                },
              ],
            },
            {
                  id: 5,
                  name: 'Défibrillateur',
                  logo: 'icones/urgence.png',
                  cout: 103680,
                  croissance: 1.12,
                  revenu: 51840,
                  vitesse: 24000,
                  quantite: 1,
                  timeleft: 0,
                  managerUnlocked: false,
                  paliers: [
                    {
                      name: 'Choc de génie !',
                      logo: 'icones/urgence.png',
                      seuil: 25,
                      idcible: 5,
                      ratio: 2,
                      typeratio: RatioType.vitesse,
                      unlocked: false,
                    },
                    {
                      name: "Bip… et ça repart !",
                      logo: 'icones/urgence.png',
                      seuil: 50,
                      idcible: 5,
                      ratio: 2,
                      typeratio: RatioType.vitesse,
                      unlocked: false,
                    },
                    {
                      name: "Sauvetage éclair !",
                      logo: 'icones/urgence.png',
                      seuil: 100,
                      idcible: 5,
                      ratio: 2,
                      typeratio: RatioType.vitesse,
                      unlocked: false,
                    },
                    {
                      name: "Voltage vital !",
                      logo: 'icones/urgence.png',
                      seuil: 200,
                      idcible: 5,
                      ratio: 3,
                      typeratio: RatioType.gain,
                      unlocked: false,
                    },
                  ],
                },
                {
                      id: 6,
                      name: 'robot de préparation',
                      logo: 'icones/pharmacie.png',
                      cout: 1244160,
                      croissance: 1.11,
                      revenu: 622080,
                      vitesse: 96000,
                      quantite: 1,
                      timeleft: 0,
                      managerUnlocked: false,
                      paliers: [
                        {
                          name: 'Pilule parfaite !',
                          logo: 'icones/pharmacie.png',
                          seuil: 25,
                          idcible: 1,
                          ratio: 2,
                          typeratio: RatioType.vitesse,
                          unlocked: false,
                        },
                        {
                          name: "Robot en pharmacie !",
                          logo: 'icones/pharmacie.png',
                          seuil: 50,
                          idcible: 6,
                          ratio: 2,
                          typeratio: RatioType.vitesse,
                          unlocked: false,
                        },
                        {
                          name: "Zéro erreur !",
                          logo: 'icones/scanner.jpg',
                          seuil: 100,
                          idcible: 6,
                          ratio: 2,
                          typeratio: RatioType.vitesse,
                          unlocked: false,
                        },
                        {
                          name: "Cocktail chimique !",
                          logo: 'icones/scanner.jpg',
                          seuil: 200,
                          idcible: 6,
                          ratio: 3,
                          typeratio: RatioType.gain,
                          unlocked: false,
                        },
                      ],
                    },
  ],
  allunlocks: [
    {
      name: 'All is better than one',
      logo: 'icones/all.jpg',
      seuil: 25,
      idcible: 0,
      ratio: 2,
      typeratio: RatioType.vitesse,
      unlocked: false,
    },
    {
      name: 'To take and not to give',
      logo: 'icones/all.jpg',
      seuil: 50,
      idcible: 0,
      ratio: 2,
      typeratio: RatioType.vitesse,
      unlocked: false,
    },
    {
      name: 'wohooooo !',
      logo: 'icones/all.jpg',
      seuil: 100,
      idcible: 0,
      ratio: 2,
      typeratio: RatioType.vitesse,
      unlocked: false,
    },
    {
      name: 'Universal Capitalist !',
      logo: 'icones/all.jpg',
      seuil: 200,
      idcible: 0,
      ratio: 2,
      typeratio: RatioType.gain,
      unlocked: false,
    },
  ],
  upgrades: [
    {
      name: 'Scanner Supersonique',
      logo: 'icones/scanner.jpg',
      seuil: 1000,
      idcible: 1,
      ratio: 3,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Chirurgie Turbo',
      logo: 'icones/table.jpg',
      seuil: 15000,
      idcible: 2,
      ratio: 3,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Confort Ciel',
      logo: 'lit.jpg',
      seuil: 30000,
      idcible: 3,
      ratio: 3,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Vitesse Galactique',
      logo: 'icones/centrifugeuse.jpg',
      seuil: 50000,
      idcible: 4,
      ratio: 3,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Choc Maître',
      logo: 'icones/défibrillateur.jpg',
      seuil: 100000,
      idcible: 5,
      ratio: 3,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Doseur Précis Plus',
      logo: 'icones/robot.jpg',
      seuil: 250000,
      idcible: 6,
      ratio: 3,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Boost Hyper',
      logo: 'icones/all.jpg',
      seuil: 1000000,
      idcible: 0,
      ratio: 3,
      typeratio: RatioType.gain,
      unlocked: false,
    },
  ],
  angelupgrades: [
    {
      name: 'Patient modèle',
      logo: 'icones/patient.png',
      seuil: 10,
      idcible: 0,
      ratio: 3,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Patient Premium',
      logo: 'icones/patient.png',
      seuil: 100000,
      idcible: -1,
      ratio: 2,
      typeratio: RatioType.ange,
      unlocked: false,
    },
    {
      name: 'Zéro douleur',
      logo: 'icones/patient.png',
      seuil: 1000000,
      idcible: -1,
      ratio: 2,
      typeratio: RatioType.ange,
      unlocked: false,
    },
    {
      name: 'Patient VIP',
      logo: 'icones/patient.png',
      seuil: 10000000,
      idcible: -1,
      ratio: 5,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Échange de lit',
      logo: 'icones/lit.png',
      seuil: 25000000,
      idcible: 3,
      ratio: 10,
      typeratio: RatioType.ange,
      unlocked: false,
    },
    {
      name: 'Échange de table d\'opération',
      logo: 'icones/table.png',
      seuil: 25000000,
      idcible: 2,
      ratio: 10,
      typeratio: RatioType.ange,
      unlocked: false,
    },
    {
      name: 'Échange de centrifugeuse',
      logo: 'icones/centrifugeuse.png',
      seuil: 25000000,
      idcible: 4,
      ratio: 10,
      typeratio: RatioType.ange,
      unlocked: false,
    },
    {
      name: 'Échange de lit',
      logo: 'icones/lit.png',
      seuil: 250000000,
      idcible: 3,
      ratio: 50,
      typeratio: RatioType.ange,
      unlocked: false,
    },
  ],
  managers: [
    {
      name: 'Dr. Bone Scan',
      logo: 'icones/bonscan.jpg',
      seuil: 10,
      idcible: 1,
      ratio: 0,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Dr. Open Hart',
      logo: 'icones/openhart.jpg',
      seuil: 15000,
      idcible: 2,
      ratio: 0,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Dr. Healy McFix',
      logo: 'icones/healymcfix.jpg',
      seuil: 100000,
      idcible: 3,
      ratio: 0,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Dr. Microscopia',
      logo: 'icones/microscopia.jpg',
      seuil: 10,
      idcible: 4,
      ratio: 0,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Dr. LifeSaver',
      logo: 'icones/lifesaver.jpg',
      seuil: 150000,
      idcible: 5,
      ratio: 0,
      typeratio: RatioType.gain,
      unlocked: false,
    },
    {
      name: 'Dr. Pill Popper',
      logo: 'icones/pillpopper.jpg',
      seuil: 1000000,
      idcible: 6,
      ratio: 0,
      typeratio: RatioType.gain,
      unlocked: false,
    },
  ],
};
