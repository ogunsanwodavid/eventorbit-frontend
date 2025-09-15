import z from "zod";

const TimeAndPlaceFormSchema = z
  .object({
    startDate: z.date("Start date is required"),
    endDate: z.date("End date is required"),
    address: z.string().trim().nonempty("Address is required").optional(),
    venueName: z.string().trim().nonempty("Venue name is required").optional(),
    organizerAddress: z
      .string()
      .trim()
      .nonempty("Organizer's address is required")
      .optional(),
    connectionDetails: z
      .string()
      .trim()
      .nonempty("Connection details is required")
      .optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export default TimeAndPlaceFormSchema;

export type TimeAndPlaceFormType = z.infer<typeof TimeAndPlaceFormSchema>;
