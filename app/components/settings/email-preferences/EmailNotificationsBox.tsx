"use client";

import { FormEvent, useState } from "react";

import { useAppDispatch } from "@/app/hooks/global/redux";

import { EmailPreferences } from "@/app/models/settings";

import { updateEmailPreferences } from "@/app/api/settings/email-preferences/update-email-preferences";

import { fetchEmailPreferences } from "@/app/actions/settings/email-preferences/fetchEmailPreferences";

import { toast } from "sonner";

import EmailNotisCheckBox from "./EmailNotisCheckBox";
import UnsubscribeAllEmailsBox from "./UnsubscribeAllEmailsBox";

import Button from "../Button";

interface EmailNotificationsBoxProps {
  emailPreferences: EmailPreferences | null;
}

export default function EmailNotificationsBox({
  emailPreferences,
}: EmailNotificationsBoxProps) {
  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Input values
  const [unsubscribe, setUnsubscribe] = useState<boolean>(
    emailPreferences?.allEmails.unsubscribe ?? false
  );
  const [tickets, setTickets] = useState<boolean>(
    emailPreferences?.confirmationEmails.tickets ?? false
  );
  const [eventReminder, setEventReminder] = useState<boolean>(
    emailPreferences?.bookingEmails.eventReminder ?? false
  );
  const [cancellationAndRefund, setCancellationAndRefund] = useState<boolean>(
    emailPreferences?.bookingEmails.cancellationAndRefund ?? false
  );
  const [paymentIssues, setPaymentIssues] = useState<boolean>(
    emailPreferences?.bookingEmails.paymentIssues ?? false
  );
  const [ticketTransfer, setTicketTransfer] = useState<boolean>(
    emailPreferences?.bookingEmails.ticketTransfer ?? false
  );
  const [waitlistNotis, setWaitlistNotis] = useState<boolean>(
    emailPreferences?.bookingEmails.waitlistNotis ?? false
  );
  const [yourAccount, setYourAccount] = useState<boolean>(
    emailPreferences?.accountEmails.yourAccount ?? false
  );
  const [messages, setMessages] = useState<boolean>(
    emailPreferences?.accountEmails.messages ?? false
  );
  const [bookingNotis, setBookingNotis] = useState<boolean>(
    emailPreferences?.hostEmails.bookingNotis ?? false
  );
  const [yourEvent, setYourEvent] = useState<boolean>(
    emailPreferences?.hostEmails.yourEvent ?? false
  );
  const [weeklyUpdates, setWeeklyUpdates] = useState<boolean>(
    emailPreferences?.marketingEmails.weeklyUpdates ?? false
  );
  const [others, setOthers] = useState<boolean>(
    emailPreferences?.marketingEmails.others ?? false
  );

  //Loading states
  const [isUpdatingEmailPreferences, setIsUpdatingEmailPreferences] =
    useState<boolean>(false);

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    //Set loading state true
    setIsUpdatingEmailPreferences(true);

    //Prevent default
    e.preventDefault();

    //Collect form data
    const formData = new FormData();
    formData.append("unsubscribe", String(unsubscribe));
    formData.append("tickets", String(tickets));
    formData.append("eventReminder", String(eventReminder));
    formData.append("cancellationAndRefund", String(cancellationAndRefund));
    formData.append("paymentIssues", String(paymentIssues));
    formData.append("ticketTransfer", String(ticketTransfer));
    formData.append("waitlistNotis", String(waitlistNotis));
    formData.append("yourAccount", String(yourAccount));
    formData.append("messages", String(messages));
    formData.append("bookingNotis", String(bookingNotis));
    formData.append("yourEvent", String(yourEvent));
    formData.append("weeklyUpdates", String(weeklyUpdates));
    formData.append("others", String(others));

    //Call the update email prefs function
    const result = await updateEmailPreferences(formData);

    //Check if request is successful
    if (result.success === true) {
      //Refresh email pref state in Redux
      await dispatch(fetchEmailPreferences());

      //Toast success
      toast.success(result.message);
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsUpdatingEmailPreferences(false);
  };

  return (
    <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] py-6 px-4 flex flex-col lg:px-6">
      {/** Heading */}
      <h3 className="text-black text-[19px] font-semibold">
        Email notifications
      </h3>

      {/** Unsubscribe all emails error */}
      {unsubscribe && <UnsubscribeAllEmailsBox />}

      {/** Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        {/** Receiving emails */}
        <section className="mb-5">
          {/** Header */}
          <h5 className="text-black-2 text-[17px] font-medium">
            Receiving EventOrbit emails
          </h5>

          {/** Checkboxes */}
          <EmailNotisCheckBox
            notis={unsubscribe}
            setNotis={setUnsubscribe}
            text="Unsubscribe me from all EventOrbit emails"
          />
        </section>

        {/** Confirmation emails */}
        <section className="mb-5">
          {/** Header */}
          <h5 className="text-black-2 text-[17px] font-medium">
            Confirmation emails
          </h5>

          {/** Checkboxes */}
          <EmailNotisCheckBox
            notis={tickets}
            setNotis={setTickets}
            text="Ticket emails"
            disabled={unsubscribe}
          />
        </section>

        {/** Booking emails */}
        <section className="mb-5">
          {/** Header */}
          <h5 className="text-black-2 text-[17px] font-medium">
            Booking emails
          </h5>

          {/** Checkboxes */}
          <EmailNotisCheckBox
            notis={eventReminder}
            setNotis={setEventReminder}
            text="Event reminder emails"
            disabled={unsubscribe}
          />
          <EmailNotisCheckBox
            notis={cancellationAndRefund}
            setNotis={setCancellationAndRefund}
            text="Cancellation and refund confirmation"
            disabled={unsubscribe}
          />
          <EmailNotisCheckBox
            notis={paymentIssues}
            setNotis={setPaymentIssues}
            text="Notices about payment issues and updates"
            disabled={unsubscribe}
          />
          <EmailNotisCheckBox
            notis={ticketTransfer}
            setNotis={setTicketTransfer}
            text="Ticket transfer emails"
            disabled={unsubscribe}
          />
          <EmailNotisCheckBox
            notis={waitlistNotis}
            setNotis={setWaitlistNotis}
            text="Waitlist notifications"
            disabled={unsubscribe}
          />
        </section>

        {/** Account emails */}
        <section className="mb-5">
          {/** Header */}
          <h5 className="text-black-2 text-[17px] font-medium">
            Account emails
          </h5>

          {/** Checkboxes */}
          <EmailNotisCheckBox
            notis={yourAccount}
            setNotis={setYourAccount}
            text="Emails about your account"
            disabled={unsubscribe}
          />
          <EmailNotisCheckBox
            notis={messages}
            setNotis={setMessages}
            text="Messages from other users on EventOrbit"
            disabled={unsubscribe}
          />
        </section>

        {/** Hosting emails */}
        <section className="mb-5">
          {/** Header */}
          <h5 className="text-black-2 text-[17px] font-medium">
            Hosting emails
          </h5>

          {/** Checkboxes */}
          <EmailNotisCheckBox
            notis={bookingNotis}
            setNotis={setBookingNotis}
            text="Booking notifications for your events"
            disabled={unsubscribe}
          />
          <EmailNotisCheckBox
            notis={yourEvent}
            setNotis={setYourEvent}
            text="Emails about your event"
            disabled={unsubscribe}
          />
        </section>

        {/** Marketing emails */}
        <section className="mb-5">
          {/** Header */}
          <h5 className="text-black-2 text-[17px] font-medium">
            Marketing emails
          </h5>

          {/** Checkboxes */}
          <EmailNotisCheckBox
            notis={weeklyUpdates}
            setNotis={setWeeklyUpdates}
            text="Weekly update of events near you"
            disabled={unsubscribe}
          />
          <EmailNotisCheckBox
            notis={others}
            setNotis={setOthers}
            text="Other marketing emails"
            disabled={unsubscribe}
          />
        </section>

        {/** Submit button */}
        <div className="mt-[9px] w-[154px] ml-auto">
          <Button
            isLoading={isUpdatingEmailPreferences}
            text="save preferences"
            disabled={isUpdatingEmailPreferences}
          />
        </div>
      </form>
    </section>
  );
}
