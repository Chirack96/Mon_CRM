import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { Marketing } from '../models/marketing.model'; // Import du modèle Marketing

@Component({
  selector: 'app-marketing',
  standalone: true,
  imports: [NgForOf, NgIf, FormsModule],
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss']
})
export class MarketingComponent implements OnInit, AfterViewInit {

  @ViewChild('performanceChart') performanceChart!: ElementRef;

  // Liste des campagnes avec des performances individuelles
  campaigns: Marketing[] = [];

  // Modèle pour la création d'une nouvelle campagne
  newCampaign: Marketing = {
    name: '',
    objective: '',
    startDate: '',
    endDate: '',
    status: 'planned',
    leadsGenerated: 0,
    conversionRate: 0,
    performance: {
      labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
      leads: [0, 0, 0, 0],
      conversions: [0, 0, 0, 0]
    }
  };

  // Campagne sélectionnée pour afficher les détails
  selectedCampaign: Marketing | null = null;

  // Variable pour afficher/masquer le formulaire
  showForm = false;

  // Variable pour stocker les graphiques individuels
  individualCharts: any[] = [];

  constructor() {
    // Enregistrer les composants Chart.js nécessaires
    Chart.register(...registerables);
  }

  ngOnInit() {
    // Simulation de données de campagnes existantes (cela peut provenir d'une API réelle)
    this.campaigns = [
      {
        id: 1,
        name: 'Lancement Produit X',
        objective: 'Générer des leads',
        startDate: '2024-01-01',
        endDate: '2024-02-01',
        status: 'active',
        leadsGenerated: 150,
        conversionRate: 7.5,
        budget: 5000,
        roi: 25000,
        description: 'Lancement du produit X.',
        performance: {
          labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
          leads: [50, 40, 35, 25],
          conversions: [5, 7, 6, 4]
        }
      },
      {
        id: 2,
        name: 'Webinar Marketing Mars 2024',
        objective: 'Présenter un nouveau produit',
        startDate: '2024-03-01',
        endDate: '2024-03-31',
        status: 'planned',
        leadsGenerated: 0,
        conversionRate: 0,
        performance: {
          labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
          leads: [0, 0, 0, 0],
          conversions: [0, 0, 0, 0]
        }
      }
    ];
  }

  ngAfterViewInit() {
    this.createPerformanceChart(); // Crée le graphique global une fois que la vue est rendue
  }

  // Créer une nouvelle campagne et l'ajouter à la liste
  createCampaign() {
    const newId = this.campaigns.length ? Math.max(...this.campaigns.map(c => c.id || 0)) + 1 : 1;
    this.campaigns.push({
      ...this.newCampaign,
      id: newId,
      performance: {
        labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
        leads: [0, 0, 0, 0],
        conversions: [0, 0, 0, 0]
      }
    });
    this.resetForm(); // Réinitialiser le formulaire après la création
    this.showForm = false; // Masquer le formulaire après la création
  }

  // Basculer l'affichage du formulaire
  toggleForm() {
    this.showForm = !this.showForm;
  }

  // Supprimer une campagne par son index
  deleteCampaign(index: number) {
    if (index >= 0 && index < this.campaigns.length) {
      this.campaigns.splice(index, 1); // Supprimer la campagne à l'index donné
      this.selectedCampaign = null; // Réinitialiser la sélection
    }
  }

  // Réinitialiser le formulaire après la création
  resetForm() {
    this.newCampaign = {
      name: '',
      objective: '',
      startDate: '',
      endDate: '',
      status: 'planned',
      leadsGenerated: 0,
      conversionRate: 0,
      performance: {
        labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
        leads: [0, 0, 0, 0],
        conversions: [0, 0, 0, 0]
      }
    };
  }

  // Fonction pour créer et afficher le graphique de performance général
  createPerformanceChart() {
    const ctx = this.performanceChart?.nativeElement?.getContext('2d');
    if (ctx) {  // Vérifier si ctx n'est pas null
      new Chart(ctx, {
        type: 'line', // Type de graphique
        data: {
          labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'], // Les labels
          datasets: [
            {
              label: 'Leads générés',
              data: [65, 59, 80, 81, 56, 55],
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
            {
              label: 'Conversions',
              data: [28, 48, 40, 19, 86, 27],
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              fill: true,
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            x: {
              beginAtZero: true
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  // Créer un graphique individuel pour une campagne spécifique
  createIndividualChart(index: number) {
    const campaign = this.campaigns[index];
    const canvasId = `campaignPerformanceChart${index}`;  // Générer l'ID dynamique

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;  // Récupérer le canvas
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Si un graphique existe déjà, on le détruit avant d'en créer un nouveau
        if (this.individualCharts[index]) {
          this.individualCharts[index].destroy();
        }

        // Créer le graphique pour cette campagne
        this.individualCharts[index] = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: campaign.performance?.labels,
            datasets: [
              {
                label: 'Leads générés',
                data: campaign.performance?.leads,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              },
              {
                label: 'Conversions',
                data: campaign.performance?.conversions,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  }
}
