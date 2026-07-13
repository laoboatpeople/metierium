// Singleton in-memory admin settings
// Persisted only for the lifetime of the server process.

export interface AdminSettings {
  // Organization
  orgName: string;
  orgEmail: string;
  timezone: string;
  // Exam defaults
  passingScore: number;
  timeLimit: number;
  questionsPerSimulation: number;
  randomizeOrder: boolean;
  // Notifications
  emailNotifications: boolean;
  welcomeEmail: boolean;
  reminderEmails: boolean;
  adminNewUserAlert: boolean;
  adminNotificationEmail: string;
  // Security
  sessionTimeout: number;
  requireEmailVerification: boolean;
}

let settings: AdminSettings = {
  orgName: 'Metierium',
  orgEmail: 'info@metierium.com',
  timezone: 'America/Toronto',
  passingScore: 70,
  timeLimit: 60,
  questionsPerSimulation: 50,
  randomizeOrder: false,
  emailNotifications: true,
  welcomeEmail: true,
  reminderEmails: true,
  adminNewUserAlert: true,
  adminNotificationEmail: 'chuck.onekeo@gmail.com',
  sessionTimeout: 60,
  requireEmailVerification: false,
};

export function getSettings(): AdminSettings {
  return { ...settings };
}

export function updateSettings(partial: Partial<AdminSettings>): AdminSettings {
  settings = { ...settings, ...partial };
  return { ...settings };
}
