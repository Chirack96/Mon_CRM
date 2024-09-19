import { Component, OnInit } from '@angular/core';
import { PayrollEntryService } from '../services/payroll-entry.service';
import { UserService } from '../services/user.service';
import { PayrollEntry } from '../models/payroll-entry.model';
import { User } from '../models/user.model';
import { NgIf, NgForOf, formatDate, NgClass } from '@angular/common';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from "@angular/forms";

// Étendre le modèle de données pour ajouter la propriété isEditing localement
interface PayrollEntryWithEditing extends PayrollEntry {
  isEditing?: boolean;
}

@Component({
  selector: 'app-payroll-management',
  standalone: true,
  templateUrl: './payroll-management.component.html',
  styleUrls: ['./payroll-management.component.scss'],
  imports: [
    CurrencyPipe,
    DatePipe,
    NgForOf,
    FormsModule,
    NgIf,
    NgClass
  ],
  animations: [
    trigger('fadeInSlideIn', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class PayrollManagementComponent implements OnInit {
  payrollEntries: PayrollEntryWithEditing[] = []; // Utiliser le type étendu avec isEditing
  selectedPayrollEntry: PayrollEntry | null = null;
  showForm = false;
  newPayrollEntry: PayrollEntry = { userId: 0, amount: 0, paymentDate: '' };
  users: User[] = []; // Liste des utilisateurs
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(
    private payrollEntryService: PayrollEntryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadPayrollEntries().then(r => console.log('Payroll entries loaded'));
    this.loadUsers().then(r => console.log('Users loaded'));
  }

  // Charger toutes les entrées de paie
  async loadPayrollEntries() {
    try {
      this.payrollEntries = await this.payrollEntryService.getAllPayrollEntries();
    } catch (error) {
      this.showAlert('Erreur lors de la récupération des entrées de paie.', 'error');
    }
  }

  // Charger tous les utilisateurs
  async loadUsers() {
    try {
      this.users = await this.userService.getUsers();
    } catch (error) {
      this.showAlert('Erreur lors de la récupération des utilisateurs.', 'error');
    }
  }

  // Créer une nouvelle entrée de paie
  async createPayrollEntry() {
    try {
      const formattedDate = formatDate(this.newPayrollEntry.paymentDate, 'yyyy-MM-dd', 'en-US');
      this.newPayrollEntry.paymentDate = formattedDate;

      const payrollEntryToSend = {
        ...this.newPayrollEntry,
        userId: Number(this.newPayrollEntry.userId)
      };

      const createdEntry = await this.payrollEntryService.createPayrollEntry(payrollEntryToSend);
      this.payrollEntries.push(createdEntry);
      this.resetForm();
      this.showAlert('Entrée de paie créée avec succès !', 'success');
    } catch (error) {
      this.showAlert('Échec de la création de l\'entrée de paie.', 'error');
    }
  }

  // Mettre à jour une entrée de paie existante
  async updatePayrollEntry(id: number | undefined, payrollEntry: PayrollEntryWithEditing): Promise<void> {
    try {
      if (!id) {
        this.showAlert('ID manquant pour la mise à jour.', 'error');
        return;
      }

      // Formater la date avant de l'envoyer au backend
      const formattedDate = formatDate(payrollEntry.paymentDate, 'yyyy-MM-dd', 'en-US');
      payrollEntry.paymentDate = formattedDate;

      // Créer une copie de l'objet sans la propriété `isEditing`
      const { isEditing, ...payloadToSend } = {
        ...payrollEntry,
        id: Number(id),  // Conversion de l'ID en `number`
        userId: Number(payrollEntry.userId)  // Conversion du `userId` en `number`
      };

      // Appel du service pour la mise à jour
      const updatedEntry = await this.payrollEntryService.updatePayrollEntry(id, payloadToSend);

      // Mettre à jour l'interface utilisateur
      this.payrollEntries = this.payrollEntries.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      );

      // Afficher une notification de succès
      this.showAlert('Entrée de paie mise à jour avec succès!', 'success');

    } catch (error) {
      // En cas d'erreur, afficher une alerte
      this.showAlert('Échec de la mise à jour de l\'entrée de paie.', 'error');
    }
  }


  // Supprimer une entrée de paie par ID
  async deletePayrollEntry(id: number | undefined) {
    if (id === undefined || id === null) {
      this.showAlert('Impossible de supprimer : ID manquant.', 'error');
      return;
    }

    try {
      await this.payrollEntryService.deletePayrollEntry(id);
      this.payrollEntries = this.payrollEntries.filter(entry => entry.id !== id);
      this.showAlert('Entrée de paie supprimée avec succès !', 'success');
    } catch (error) {
      this.showAlert('Échec de la suppression de l\'entrée de paie.', 'error');
    }
  }


  // Méthode pour activer l'édition d'une entrée de paie
  editPayrollEntry(entry: PayrollEntryWithEditing) {
    this.payrollEntries.forEach(e => e.isEditing = false); // Désactiver l'édition pour les autres
    entry.isEditing = true; // Activer l'édition pour l'entrée sélectionnée
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.selectedPayrollEntry = null; // Réinitialiser la sélection lors de l'ouverture du formulaire
    }
  }
  // Réinitialiser le formulaire
  resetForm() {
    this.newPayrollEntry = { userId: 0, amount: 0, paymentDate: '' };
    this.showForm = false;
  }

  getUserNameById(userId: number): string {
    const user = this.users.find(user => user.id === userId);
    return user ? `${user.firstname} ${user.lastname}` : 'Inconnu';
  }

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
    }, 3000);
  }
}
