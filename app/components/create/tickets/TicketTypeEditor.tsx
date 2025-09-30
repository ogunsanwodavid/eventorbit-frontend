import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { TicketType } from "@/app/models/events";

import { nanoid } from "nanoid";

import { TicketTypeInput } from "./Tickets";

import Select from "../Select";

import Input from "../../ui/global/Input";

import Copy from "../../ui/icons/Copy";
import Delete from "../../ui/icons/Delete";

interface TicketTypeEditorProps {
  ticketTypeId: string;
  mode: "paid" | "free" | "donation";
  ticketType: Omit<TicketType, "_id" | "sold"> | null;
  ticketTypeInputs: TicketTypeInput[];
  setTicketTypeInputs: Dispatch<SetStateAction<TicketTypeInput[]>>;
  ticketTypeErrorIds: string[];
}

export default function TicketTypeEditor({
  ticketTypeId,
  mode,
  ticketType,
  ticketTypeInputs,
  setTicketTypeInputs,
  ticketTypeErrorIds,
}: TicketTypeEditorProps) {
  //Input values
  const [type, setType] = useState<string>(ticketType?.type || mode);
  const [name, setName] = useState<string>(ticketType?.name || "");
  const [quantity, setQuantity] = useState<number | null>(
    ticketType?.quantity || null
  );
  const [cost, setCost] = useState<number | null>(
    ticketType?.price || ticketType?.minDonation || null
  );

  //Input errors
  const [hasInputErrors, setHasInputErrors] = useState<boolean>(false);
  const hasNameError = hasInputErrors && !name;
  const hasCostError = hasInputErrors && type !== "free" && !cost;

  //Change cost when type changes
  useEffect(() => {
    if (type === "free") {
      setCost(null);
    }
  }, [type]);

  //Type select options
  const typeSelectOptions = [
    { value: "paid", label: "Paid" },
    { value: "free", label: "Free" },
    { value: "donation", label: "Donation" },
  ];

  //Handle duplicate ticket
  function handleDuplicateTicket() {
    setTicketTypeInputs((prev) => {
      const index = prev.findIndex((ticket) => ticket.id === ticketTypeId);

      if (index === -1) return prev; //not found, return original state

      const newTicket = {
        id: nanoid(),
        mode: type as "paid" | "free" | "donation",
        ticketType: {
          type: type as "paid" | "free" | "donation",
          name,
          quantity: quantity || undefined,
          price: mode === "paid" && cost ? cost : undefined,
          minDonation: mode === "donation" && cost ? cost : undefined,
        },
      };

      const updated = [...prev];
      updated.splice(index + 1, 0, newTicket); //insert right after found index
      return updated;
    });
  }

  //Handle delete ticket
  function handleDeleteTicket() {
    setTicketTypeInputs((prev) =>
      prev.filter((input) => input.id !== ticketTypeId)
    );
  }

  //Check if all inputs are complete and update ticket types
  useEffect(() => {
    if (
      name &&
      (type === "free" || ((type === "paid" || type === "donation") && cost))
    ) {
      setTicketTypeInputs((prev) => {
        return prev.map((input) =>
          input.id === ticketTypeId
            ? {
                ...input,
                mode: type as "free" | "paid" | "donation",
                ticketType: {
                  type: type as "free" | "paid" | "donation",
                  name,
                  quantity: quantity || undefined,
                  price: type === "paid" ? cost! : undefined,
                  minDonation: type === "donation" ? cost! : undefined,
                },
              }
            : input
        );
      });
    } else {
      setTicketTypeInputs((prev) => {
        return prev.map((input) =>
          input.id === ticketTypeId
            ? {
                ...input,
                mode: type as "free" | "paid" | "donation",
                ticketType: null,
              }
            : input
        );
      });
    }
  }, [name, quantity, type, cost, ticketTypeId, setTicketTypeInputs]);

  //Check if there are input errors
  useEffect(() => {
    if (ticketTypeErrorIds.includes(ticketTypeId)) {
      setHasInputErrors(true);
    } else {
      setHasInputErrors(false);
    }
  }, [ticketTypeErrorIds, ticketTypeId]);

  return (
    <div className="p-6 border-t-[1px] border-[#e2e5e7] space-y-4 md:space-y-0 md:grid md:grid-cols-[130px_1fr_120px_120px] md:gap-x-4 md:gap-y-6">
      {/** Ticket type select */}
      <section className="flex flex-col gap-y-1.5 text-[15px] text-black-2 font-medium">
        <label htmlFor="ticketType" className="md:hidden">
          Ticket type
        </label>

        <Select
          value={type}
          setValue={setType}
          items={typeSelectOptions}
          triggerClassName="!h-[42px]"
        />
      </section>

      {/** Ticket name input */}
      <section className="flex flex-col gap-y-1.5 text-[15px] text-black-2 font-medium">
        <label htmlFor="ticketName" className="md:hidden">
          Ticket name
        </label>

        <Input
          name="ticketName"
          value={name}
          setValue={setName}
          placeholder="e.g. General Admission"
          className="!mb-0"
          inputClassName={`p-3 ${
            hasNameError && "!bg-error-red-3 && !border-error-red"
          }`}
        />
      </section>

      {/** Quantity */}
      <section className="flex flex-col gap-y-1.5 text-[15px] text-black-2 font-medium">
        <label htmlFor="quantity" className="md:hidden">
          Quantity
        </label>

        <input
          type="text"
          name="quantity"
          value={quantity ? String(quantity) : ""}
          className={`w-full h-[42px] p-3 border-[1px] border-[#e2e5e7] outline-0 rounded-[6px] focus:border-teal`}
          placeholder="Unlimited"
          inputMode="numeric"
          onChange={(e) => {
            let val = e.target.value.replace(/\D/g, ""); //remove non-digits
            if (val.startsWith("0")) {
              val = val.replace(/^0+/, ""); //strip leading zeros
            }
            setQuantity(Number(val));
          }}
        />
      </section>

      {/** Price */}
      <section className="flex flex-col gap-y-1.5 text-[15px] text-black-2 font-medium">
        <label htmlFor="price" className="md:hidden">
          Price
        </label>

        <input
          type="text"
          name="price"
          value={cost ? String(cost) : ""}
          className={`w-full h-[42px] p-3 border-[1px] border-[#e2e5e7] outline-0 rounded-[6px] focus:border-teal ${
            hasCostError && "!bg-error-red-3 && !border-error-red"
          }`}
          placeholder={
            type === "paid" ? "Cost" : type === "donation" ? "Minimum" : "Free"
          }
          inputMode="numeric"
          onChange={(e) => {
            let val = e.target.value.replace(/\D/g, ""); //remove non-digits
            if (val.startsWith("0")) {
              val = val.replace(/^0+/, ""); //strip leading zeros
            }
            setCost(Number(val));
          }}
          disabled={type === "free"}
        />
      </section>

      {/** Actions */}
      <section className="flex flex-col gap-y-1.5 text-[15px] text-black-2 font-medium md:col-span-4">
        <p className="md:hidden">Actions</p>

        <main className="flex items-center gap-x-6 md:gap-x-3 md:w-max md:ml-auto">
          {/** Duplicate */}
          <button
            className="relative block w-max border-[1px] border-[#e2e5e7] px-3 py-2 text-gray rounded-[6px] cursor-pointer group"
            onClick={handleDuplicateTicket}
          >
            {/** Icon */}
            <Copy size="21" />

            {/** Modal */}
            <div className="hidden absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+10px)] bg-black-2 p-2 text-white text-[13.5px] rounded-[6px] duration-250 transition-all group-hover:block">
              Duplicate
            </div>
          </button>

          {/** Delete */}
          <button
            className={`relative block w-max border-[1px] border-[#e2e5e7] px-3 py-2 text-gray rounded-[6px] cursor-pointer ${
              ticketTypeInputs.length === 1 ? "opacity-50" : "group"
            }`}
            onClick={handleDeleteTicket}
            disabled={ticketTypeInputs.length === 1}
          >
            {/** Icon */}
            <Delete size="21" />

            {/** Modal */}
            <div className="hidden absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+10px)] bg-black-2 p-2 text-white text-[13.5px] rounded-[6px] duration-250 transition-all group-hover:block">
              Delete
            </div>
          </button>
        </main>
      </section>
    </div>
  );
}
