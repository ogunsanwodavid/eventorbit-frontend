import { z } from "zod";

const UpdateProfileSocialUrlsFormSchema = z.object({
  website: z
    .url()
    .refine((url) => !url || url.startsWith("https://"), {
      message: "Website must be an HTTPS URL",
    })
    .optional(),
  facebook: z
    .url("Facebook link must be a valid URL")
    .refine(
      (url) =>
        url.startsWith("https://www.facebook.com") ||
        url.startsWith("https://facebook.com"),
      {
        message: "Link must be a valid Facebook URL",
      }
    )
    .optional(),

  x: z
    .url("X link must be a valid URL")
    .refine(
      (url) =>
        url.startsWith("https://twitter.com") ||
        url.startsWith("https://www.twitter.com") ||
        url.startsWith("https://x.com") ||
        url.startsWith("https://www.x.com"),
      {
        message: "Link must be a valid X / Twitter URL",
      }
    )
    .optional(),

  instagram: z
    .url("Instagram link must be a valid URL")
    .refine(
      (url) =>
        url.startsWith("https://www.instagram.com") ||
        url.startsWith("https://instagram.com"),
      {
        message: "Link must be a valid Instagram URL",
      }
    )
    .optional(),
});

export default UpdateProfileSocialUrlsFormSchema;

export type UpdateProfileInfoFormType = z.infer<
  typeof UpdateProfileSocialUrlsFormSchema
>;
