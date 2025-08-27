export interface Account {
  email: string;
  location?: string;
  policies?: { termsAndConditions: string; privacyPolicy: string };
}

export interface AccountState {
  account: Account | null;
  loading: boolean;
  error: string | null;
}

export interface EmailPreferences {
  allEmails: {
    unsubscribe: boolean;
  };
  confirmationEmails: {
    tickets: boolean;
  };
  bookingEmails: {
    eventReminder: boolean;
    cancellationAndRefund: boolean;
    paymentIssues: boolean;
    ticketTransfer: boolean;
    waitlistNotis: boolean;
  };
  accountEmails: {
    yourAccount: boolean;
    messages: boolean;
  };
  hostEmails: {
    bookingNotis: boolean;
    yourEvent: boolean;
  };
  marketingEmails: {
    weeklyUpdates: boolean;
    others: boolean;
  };
}

export interface EmailPreferencesState {
  emailPreferences: EmailPreferences | null;
  loading: boolean;
  error: string | null;
}
