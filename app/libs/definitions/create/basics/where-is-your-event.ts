import z from "zod";

const EventLocationFormSchema = z.object({
  address: z.string().trim().nonempty("Address is required"),
  venueName: z.string().trim().nonempty("Venue name is required"),
});

export default EventLocationFormSchema;

export type AboutYourEventFormType = z.infer<typeof EventLocationFormSchema>;
