import { Injectable } from '@angular/core';
import axios from 'axios';
import { AxiosError } from 'axios';
import { environment } from '../../environments/environment';
import { PayrollEntry } from '../models/payroll-entry.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollEntryService {
  private baseUrl = `${environment.apiUrl}/payroll-entries`;

  constructor() { }

  // Obtenir toutes les entrées de paie
  async getAllPayrollEntries(): Promise<PayrollEntry[]> {
    try {
      const response = await axios.get<PayrollEntry[]>(this.baseUrl, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des entrées de paie', error);
      throw error;
    }
  }

  // Créer une nouvelle entrée de paie
  async createPayrollEntry(payrollEntry: PayrollEntry): Promise<PayrollEntry> {
    try {
      const response = await axios.post<PayrollEntry>(this.baseUrl, payrollEntry, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Erreur Axios renvoyée par le backend :', error.response?.data);
        throw new Error(error.response?.data?.error || 'Impossible de créer l\'entrée de paie.');
      } else {
        console.error('Erreur inconnue lors de la création de l\'entrée de paie', error);
        throw new Error('Erreur inconnue.');
      }
    }
  }

  // Mettre à jour une entrée de paie existante
  async updatePayrollEntry(id: number, payrollEntry: PayrollEntry): Promise<PayrollEntry> {
    if (!id) {
      throw new Error('ID manquant pour la mise à jour');
    }

    try {
      const response = await axios.put<PayrollEntry>(`${this.baseUrl}/${id}`, payrollEntry, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entrée de paie', error);
      throw error;
    }
  }


// Supprimer une entrée de paie par ID
  async deletePayrollEntry(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'entrée de paie', error);
      throw error;
    }
  }

  // Obtenir une entrée de paie par ID
  async getPayrollEntryById(id: number | undefined): Promise<PayrollEntry> {
    try {
      const response = await axios.get<PayrollEntry>(`${this.baseUrl}/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'entrée de paie par ID', error);
      throw error;
    }
  }


  async getPayrollEntriesByUserId(userId: number): Promise<PayrollEntry[]> {
    try {
      const response = await axios.get<PayrollEntry[]>(`${this.baseUrl}/user/${userId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des entrées de paie par ID utilisateur', error);
      throw error;
    }
  }
}
