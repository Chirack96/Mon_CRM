// Définition d'un modèle pour les données de performance
export interface PerformanceData {
  labels: string[]; // Labels pour la période (ex. Semaine 1, Semaine 2, etc.)
  leads: number[]; // Nombre de leads générés chaque semaine
  conversions: number[]; // Nombre de conversions chaque semaine
}

// Modèle principal de Marketing mis à jour
export interface Marketing {
  id?: number; // ID unique de la campagne
  name: string; // Nom de la campagne marketing
  objective: string; // Objectif de la campagne
  startDate: string; // Date de début
  endDate: string; // Date de fin
  status: 'planned' | 'active' | 'completed' | 'canceled'; // Statut de la campagne
  leadsGenerated: number; // Leads générés par la campagne
  conversionRate: number; // Taux de conversion en %
  budget?: number; // Budget alloué (optionnel)
  roi?: number; // Retour sur investissement (optionnel)
  description?: string; // Description de la campagne (optionnel)

  // Nouvelle propriété pour les performances de la campagne
  performance?: PerformanceData; // Données de performance (labels, leads, conversions)
}
