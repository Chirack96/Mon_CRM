// src/app/models/payroll-entry.model.ts

export interface PayrollEntry {
  id?: number;
  userId: number;  // Correspond à l'id de l'utilisateur
  amount: number;
  paymentDate: string; // Utilise le format ISO ou ajuste selon les besoins
}
