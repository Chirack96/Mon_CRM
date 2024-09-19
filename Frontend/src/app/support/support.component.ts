import { Component } from '@angular/core';
import {NgClass, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    NgClass,
    UpperCasePipe,
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent {
  // FAQ Section
  faqs = [
    { id: 1, question: 'Comment créer un compte ?', answer: 'Vous pouvez créer un compte en accédant à la page d’inscription...', isOpen: false },
    { id: 2, question: 'Comment réinitialiser mon mot de passe ?', answer: 'Pour réinitialiser votre mot de passe, cliquez sur “Mot de passe oublié” sur la page de connexion.', isOpen: false },
    { id: 3, question: 'Où trouver les guides de démarrage ?', answer: 'Tous les guides sont disponibles dans la section Documentation.', isOpen: false }
  ];

  toggleFaq(id: number) {
    this.faqs = this.faqs.map(faq => faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq);
  }

  // Ticket Submission Form
  ticket = {
    name: '',
    email: '',
    issue: ''
  };

  submitTicket() {
    console.log('Ticket soumis : ', this.ticket);
    alert('Votre demande de support a été soumise avec succès.');
    this.resetForm();
  }

  resetForm() {
    this.ticket = {
      name: '',
      email: '',
      issue: ''
    };
  }

  // Live Chat
  chatMessages = [
    { text: 'Bonjour, comment puis-je vous aider ?', isAgent: true }
  ];

  userMessage = '';

  sendMessage() {
    if (this.userMessage.trim()) {
      this.chatMessages.push({ text: this.userMessage, isAgent: false });
      this.userMessage = '';

      // Simuler une réponse automatique
      setTimeout(() => {
        this.chatMessages.push({ text: 'Je vais examiner votre demande.', isAgent: true });
      }, 1000);
    }
  }

  // Service Status
  services = [
    { name: 'API', status: 'ok' },
    { name: 'Base de données', status: 'ok' },
    { name: 'Service de paiement', status: 'down' }
  ];
  isTyping: any;
}
