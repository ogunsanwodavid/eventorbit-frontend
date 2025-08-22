import { z } from "zod";

const UpdateLocationFormSchema = z.object({
  location: z.string().trim().nonempty("Location is required"),
});

export default UpdateLocationFormSchema;

export type UpdateLocationFormType = z.infer<typeof UpdateLocationFormSchema>;
