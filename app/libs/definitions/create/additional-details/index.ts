import z from "zod";

const AdditionalDetailsFormSchema = z.object({
  contactDetails: z.string().trim().nonempty("Contact details is required"),
  orderMessage: z.string().trim().nonempty("Order message is required"),
});

export default AdditionalDetailsFormSchema;

export type AdditionalDetailsFormType = z.infer<
  typeof AdditionalDetailsFormSchema
>;
