// src/data/stockRecords.ts

// On exporte le type pour pouvoir le réutiliser si besoin
export type StockRecord = {
  id_stock: number;
  date: string;
  id_produit: number;
  quantite_ouverture_mois: number;
  quantite_vendu_mois: number;
  stock_actuel: number;
  quantite_approvisionner: number;
  valeur_stock: number;
  prix_unitaire?: number;
};

// On exporte les données factices
export const allStockRecords: StockRecord[] = [
  {
    id_stock: 1,
    date: '2024-06-01',
    id_produit: 1,
    quantite_ouverture_mois: 50,
    quantite_vendu_mois: 15,
    stock_actuel: 45,
    quantite_approvisionner: 10,
    valeur_stock: 9900,
    prix_unitaire: 220
  },
  {
    id_stock: 2,
    date: '2024-06-01',
    id_produit: 2,
    quantite_ouverture_mois: 30,
    quantite_vendu_mois: 8,
    stock_actuel: 22,
    quantite_approvisionner: 0,
    valeur_stock: 2860,
    prix_unitaire: 130
  },
  {
    id_stock: 3,
    date: '2024-06-01',
    id_produit: 3,
    quantite_ouverture_mois: 100,
    quantite_vendu_mois: 45,
    stock_actuel: 75,
    quantite_approvisionner: 20,
    valeur_stock: 3375,
    prix_unitaire: 45
  },
  {
    id_stock: 4,
    date: '2024-06-01',
    id_produit: 4,
    quantite_ouverture_mois: 5,
    quantite_vendu_mois: 2,
    stock_actuel: 3,
    quantite_approvisionner: 0,
    valeur_stock: 3750,
    prix_unitaire: 1250
  },
  {
    id_stock: 5,
    date: '2024-06-01',
    id_produit: 5,
    quantite_ouverture_mois: 40,
    quantite_vendu_mois: 12,
    stock_actuel: 28,
    quantite_approvisionner: 0,
    valeur_stock: 2492,
    prix_unitaire: 89
  },
  // Données pour un autre mois pour tester le filtre
  {
    id_stock: 6,
    date: '2024-05-01',
    id_produit: 1,
    quantite_ouverture_mois: 60,
    quantite_vendu_mois: 10,
    stock_actuel: 50,
    quantite_approvisionner: 0,
    valeur_stock: 11000,
    prix_unitaire: 220
  },
  {
    id_stock: 7,
    date: '2024-05-01',
    id_produit: 2,
    quantite_ouverture_mois: 40,
    quantite_vendu_mois: 10,
    stock_actuel: 30,
    quantite_approvisionner: 0,
    valeur_stock: 3900,
    prix_unitaire: 130
  },
];