import axios from "axios";

interface UpdateEmailPreferencesApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function updateEmailPreferences(formData: FormData) {
  //Form data
  const unsubscribe = formData.get("unsubscribe") === "true";
  const tickets = formData.get("tickets") === "true";
  const eventReminder = formData.get("eventReminder") === "true";
  const cancellationAndRefund =
    formData.get("cancellationAndRefund") === "true";
  const paymentIssues = formData.get("paymentIssues") === "true";
  const ticketTransfer = formData.get("ticketTransfer") === "true";
  const waitlistNotis = formData.get("waitlistNotis") === "true";
  const yourAccount = formData.get("yourAccount") === "true";
  const messages = formData.get("messages") === "true";
  const bookingNotis = formData.get("bookingNotis") === "true";
  const yourEvent = formData.get("yourEvent") === "true";
  const weeklyUpdates = formData.get("weeklyUpdates") === "true";
  const others = formData.get("others") === "true";

  //Form fields
  const formFields = {
    allEmails: { unsubscribe },
    confirmationEmails: { tickets },
    bookingEmails: {
      eventReminder,
      cancellationAndRefund,
      paymentIssues,
      ticketTransfer,
      waitlistNotis,
    },
    accountEmails: { yourAccount, messages },
    hostEmails: { bookingNotis, yourEvent },
    marketingEmails: {
      weeklyUpdates,
      others,
    },
  };

  //Update Email prefs via API
  try {
    const response = await axios.patch<UpdateEmailPreferencesApiResponse>(
      `${API_BASE_URL}/api/email-preferences/update`,
      formFields,
      { withCredentials: true }
    );

    return {
      success: true,
      message:
        response.data.message ?? "Email preferences updated successfully.",
    };
  } catch (error) {
    let errorMessage = "Failed to update email preferences.";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}
