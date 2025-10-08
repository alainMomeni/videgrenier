// src/data/users.ts

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: string; // Format ISO string pour la date
  isBlocked?: boolean; // Propriété optionnelle pour bloquer/débloquer un utilisateur
};

export const allUsers: User[] = [
  { id: 1, firstName: 'Sarah', lastName: 'Martinez', email: 'sarah.m@example.com', role: 'seller', createdAt: '2023-10-26T10:00:00Z', isBlocked: false },
  { id: 2, firstName: 'James', lastName: 'Chen', email: 'james.chen@example.com', role: 'seller', createdAt: '2023-10-25T14:30:00Z', isBlocked: false },
  { id: 3, firstName: 'Maria', lastName: 'Garcia', email: 'maria.g@example.com', role: 'buyer', createdAt: '2023-10-24T09:15:00Z', isBlocked: false },
  { id: 4, firstName: 'David', lastName: 'Smith', email: 'david.s@example.com', role: 'buyer', createdAt: '2023-10-23T18:45:00Z', isBlocked: false },
  { id: 5, firstName: 'Admin', lastName: 'User', email: 'admin@videgrenierkamer.com', role: 'admin', createdAt: '2023-01-01T08:00:00Z', isBlocked: false },
];