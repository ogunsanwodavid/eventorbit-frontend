import z from "zod";

const AboutYourEventFormSchema = z.object({
  name: z.string().trim().nonempty("Name is required"),
  description: z.string().trim().nonempty("Description is required"),
  category: z.string().trim().nonempty("Category is required"),
});

export default AboutYourEventFormSchema;

export type AboutYourEventFormType = z.infer<typeof AboutYourEventFormSchema>;
