import { useState } from "react";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { EventType, TicketType } from "@/app/models/events";

import { useAppDispatch, useAppSelector } from "@/app/hooks/global/redux";

import {
  updateCurrentStep,
  updateTickets,
} from "@/app/redux/slices/create/createEventSlice";

import { nanoid } from "nanoid";

import { toast } from "sonner";

import Select from "../Select";
import Button from "../Button";

import TicketTypeEditor from "./TicketTypeEditor";

import Plus from "../../ui/icons/Plus";

import logoTeal from "@/public/images/logo-teal.png";

import stripeLogo from "@/static/create/stripe.png";

export interface TicketTypeInput {
  id: string;
  mode: "paid" | "free" | "donation";
  ticketType: Omit<TicketType, "_id" | "sold"> | null;
}

interface TicketsProps {
  type: EventType;
}

export default function Tickets({ type }: TicketsProps) {
  //Router function
  const router = useRouter();

  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Create event step state from redux
  const createEvent = useAppSelector((state) => state.createEvent);

  //Input values
  const [ticketTypeInputs, setTicketTypeInputs] = useState<TicketTypeInput[]>(
    createEvent.event.tickets.types.map((ticketType) => {
      return {
        id: nanoid(),
        mode: ticketType.type,
        ticketType,
      };
    }) || []
  );
  const [indicateUrgency, setIndicateUrgency] = useState<boolean>(
    createEvent.event.tickets.urgency.indicate
  );
  const [urgencyPercentageSold, setUrgencyPercentageSold] = useState<string>(
    String(createEvent.event.tickets.urgency?.percentageSold) || "60"
  );
  const [buyCurrency, setBuyCurrency] = useState<string>(
    createEvent.event.tickets.currencies.buy
  );
  const [receiveCurrency, setReceiveCurrency] = useState<string>(
    createEvent.event.tickets.currencies.receive
  );
  const [refundPolicy, setRefundPolicy] = useState<string>(
    createEvent.event.tickets.refundPolicy
  );
  const [ticketTypeErrorIds, setTicketTypeErrorIds] = useState<string[]>([]);

  //Urgent percentage sold select options
  const urgentPercentageSoldOptions = [
    { value: "90", label: "90% of tickets sold" },
    { value: "80", label: "80% of tickets sold" },
    { value: "70", label: "70% of tickets sold" },
    { value: "60", label: "60% of tickets sold" },
    { value: "50", label: "50% of tickets sold" },
  ];

  //Currency select options
  const currencyOptions = [
    { value: "USD", label: "US Dollar (USD)" },
    { value: "NGN", label: "Nigerian Naira (NGN)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "JPY", label: "Japanese Yen (JPY)" },
    { value: "CNY", label: "Chinese Yuan (CNY)" },
    { value: "INR", label: "Indian Rupee (INR)" },
    { value: "CAD", label: "Canadian Dollar (CAD)" },
    { value: "AUD", label: "Australian Dollar (AUD)" },
    { value: "CHF", label: "Swiss Franc (CHF)" },
    { value: "ZAR", label: "South African Rand (ZAR)" },
    { value: "BRL", label: "Brazilian Real (BRL)" },
    { value: "AED", label: "UAE Dirham (AED)" },
    { value: "SGD", label: "Singapore Dollar (SGD)" },
    { value: "HKD", label: "Hong Kong Dollar (HKD)" },
  ];

  //Refund policy select options
  const refundPolicyOptions = [
    { value: "No refunds at any time", label: "No refunds at any time" },
    {
      value: "Refunds available 1 day before the event",
      label: "Refunds available 1 day before the event",
    },
    {
      value: "Refunds available 2 days before the event",
      label: "Refunds available 2 days before the event",
    },
    {
      value: "Refunds available 3 days before the event",
      label: "Refunds available 3 days before the event",
    },
  ];

  //Function to add different type of tickets
  function addPaidTicket() {
    setTicketTypeInputs((prev) => [
      ...prev,
      { id: nanoid(), mode: "paid", ticketType: null },
    ]);
  }

  function addFreeTicket() {
    setTicketTypeInputs((prev) => [
      ...prev,
      { id: nanoid(), mode: "free", ticketType: null },
    ]);
  }

  function addDonationTicket() {
    setTicketTypeInputs((prev) => [
      ...prev,
      { id: nanoid(), mode: "donation", ticketType: null },
    ]);
  }

  //Handle continue
  function handleContinue() {
    //If no ticket
    if (ticketTypeInputs.length === 0) {
      toast.dismiss();
      toast.error("Please create a ticket");
      return;
    }

    //Check for input errors
    //::And set id's of inputs with errors in ticketTypeErrorIds
    const inputErrors: string[] = [];

    ticketTypeInputs.map((input) => {
      if (!input.ticketType) {
        inputErrors.push(input.id);
      }
    });

    if (inputErrors.length > 0) {
      setTicketTypeErrorIds(inputErrors);
      return;
    } else {
      setTicketTypeErrorIds([]);
    }

    //Update create event redux state
    dispatch(updateCurrentStep(4));
    dispatch(
      updateTickets({
        types: ticketTypeInputs.map((input) => input.ticketType!),
        urgency: {
          indicate: indicateUrgency,
          percentageSold: indicateUrgency
            ? Number(urgencyPercentageSold)
            : undefined,
        },
        currencies: {
          buy: buyCurrency,
          receive: receiveCurrency,
        },
        refundPolicy,
      })
    );

    //Route to next step
    router.push(`/create/${type}/4`);
  }

  return (
    <div className="space-y-6">
      {/** Create your tickets box */}
      <main className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5]">
        {/** Header */}
        <header className="p-6 space-y-4">
          <h2 className="text-black-2 text-[20px] font-bold">
            Create your ticket types
          </h2>

          <p className="text-black-2 text-[15px]">
            <span className="text-error-red">*</span>Please be sure to add taxes
            on top of ticket prices after this event has been created.
          </p>
        </header>

        {/** Ticket type inputs */}
        {ticketTypeInputs.length > 0 && (
          <div>
            {/** Header for inputs */}
            <header className="hidden px-6 py-4 text-[15px] text-black-2 font-medium md:grid md:grid-cols-[130px_1fr_120px_120px] md:gap-x-4">
              <p>Type</p>
              <p>Ticket name</p>
              <p>Quantity</p>
              <p>Price</p>
            </header>

            {/** Inputs */}

            {ticketTypeInputs.map((ticketTypeInput) => {
              return (
                <TicketTypeEditor
                  key={ticketTypeInput.id}
                  ticketTypeId={ticketTypeInput.id}
                  mode={ticketTypeInput.mode}
                  ticketType={ticketTypeInput.ticketType}
                  ticketTypeInputs={ticketTypeInputs}
                  setTicketTypeInputs={setTicketTypeInputs}
                  ticketTypeErrorIds={ticketTypeErrorIds}
                />
              );
            })}
          </div>
        )}

        {/** Buttons to add a ticket */}
        <section className="p-6 bg-[#fafafa] border-y-[1px] border-[#e2e5e7]">
          {/** Add a ticket */}
          <button
            className={`w-full py-2 border-[1px] border-teal text-teal text-[15px] font-medium flex items-center justify-center gap-x-2 rounded-[6px] hover:bg-teal hover:text-white md:hidden ${
              ticketTypeInputs.length > 0 && "!bg-teal !text-white"
            }`}
            onClick={addPaidTicket}
          >
            <Plus size="16" />

            <span>Add a ticket</span>
          </button>

          {/** Buttons to add spacific ticket type */}
          <div className="hidden w-full gap-x-3 md:flex">
            {/** Paid */}
            <button
              className="w-full py-2 border-[1px] border-teal text-teal text-[15px] font-medium flex items-center justify-center gap-x-2 rounded-[6px] hover:bg-teal hover:text-white"
              onClick={addPaidTicket}
            >
              <Plus size="16" />

              <span>Paid ticket</span>
            </button>

            {/** Free */}
            <button
              className="w-full py-2 border-[1px] border-teal text-teal text-[15px] font-medium flex items-center justify-center gap-x-2 rounded-[6px] hover:bg-teal hover:text-white"
              onClick={addFreeTicket}
            >
              <Plus size="16" />

              <span>Free ticket</span>
            </button>

            {/** Donation */}
            <button
              className="w-full py-2 border-[1px] border-teal text-teal text-[15px] font-medium flex items-center justify-center gap-x-2 rounded-[6px] hover:bg-teal hover:text-white"
              onClick={addDonationTicket}
            >
              <Plus size="16" />

              <span>Donation</span>
            </button>
          </div>
        </section>

        {/** Urgency indicators */}
        <section className="p-6 space-y-5">
          {/** Urgency indicator toggler */}
          <div
            className="w-max flex items-center gap-x-2 text-[15px] text-black-2 cursor-pointer"
            onClick={() => setIndicateUrgency((prev) => !prev)}
          >
            {/** Toggler */}
            <div
              className={`w-[33px] h-[20px] p-0.25 bg-[#a9b0b7] rounded-full transition-all duration-250 ${
                indicateUrgency && "!bg-teal"
              }`}
            >
              <div
                className={`h-[18px] w-[18px] bg-white rounded-full ml-0 transition-all duration-250 ${
                  indicateUrgency && "!ml-auto"
                }`}
              ></div>
            </div>

            <p>Show urgency indicators</p>
          </div>

          {/** Select */}
          {indicateUrgency && (
            <Select
              value={urgencyPercentageSold}
              setValue={setUrgencyPercentageSold}
              items={urgentPercentageSoldOptions}
              triggerClassName="!max-w-[230px]"
            />
          )}

          <p className="text-gray text-[14.5px]">
            If a day or time is close to selling out, urgency indicators will
            appear, encouraging buyers to hurry up.{" "}
            <span className="font-medium text-teal cursor-pointer">
              Learn more.
            </span>
          </p>
        </section>
      </main>

      {/** Set your currency box */}
      <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5]">
        {/** Header */}
        <header className="p-6 pb-4">
          <h2 className="text-black-2 text-[20px] font-bold">
            Set your currency and refund preferences
          </h2>
        </header>

        {/** Currency selects */}
        <section className="pb-3 px-6 grid grid-cols-2 gap-x-3 text-[15px] text-black-2 md:grid-cols-3">
          {/** Buy */}
          <div className="space-y-2">
            <p>Buyer pays in</p>

            <Select
              value={buyCurrency}
              setValue={setBuyCurrency}
              items={currencyOptions}
            />
          </div>

          {/** Receive */}
          <div className="space-y-2">
            <p>Receive funds in</p>

            <Select
              value={receiveCurrency}
              setValue={setReceiveCurrency}
              items={currencyOptions}
            />
          </div>
        </section>

        {/** Payment processors */}
        <section className="pt-3 p-6 space-y-3">
          <p className="text-[15px] text-black-2 font-medium">
            Payment processors
          </p>

          <p className="text-gray text-[14.5px]">
            Your payment processor is currently set to EventOrbit Payments. You
            have the option to switch to Stripe in the Payments & Fees section
            before tickets are sold. Changes cannot be made after sales begin.{" "}
            <span className="font-medium text-teal cursor-pointer">
              Learn more.
            </span>
          </p>

          <div className="flex items-center gap-x-8">
            {/** Eventorbit payments logo */}
            <div>
              <Image
                src={logoTeal}
                className="w-[120px]"
                alt="eventorbit logo"
              />

              <p className="text-[13px] text-gray font-medium -mt-1">
                Payments
              </p>
            </div>

            {/** Stripe logo */}
            <Image
              src={stripeLogo}
              className="w-[65px]"
              alt="black stripe logo"
            />
          </div>
        </section>

        {/** Refund policy */}
        <section className="p-6 space-y-3 border-t-[1px] border-[#e2e5e7]">
          {/** Select */}
          <div className="space-y-2 text-[15px] text-black-2">
            <p>Set a refund policy</p>

            <div className="grid grid-cols-2 gap-x-3 md:grid-cols-3">
              <Select
                value={refundPolicy}
                setValue={setRefundPolicy}
                items={refundPolicyOptions}
                triggerClassName="!col-span-2"
              />
            </div>
          </div>

          <p className="text-gray text-[14.5px]">
            If your refund policy is changed after tickets have been sold, the
            new policy will apply to future orders only.{" "}
            <span className="font-medium text-teal cursor-pointer">
              Learn more.
            </span>
          </p>
        </section>
      </section>

      {/** Continue button */}
      <Button
        text="Continue to Additonal Details"
        className="sticky bottom-2 mt-8 md:relative  md:w-max md:ml-auto"
        onClick={handleContinue}
      />
    </div>
  );
}
