import * as Yup from "yup";

export const changeDisplayNameSchema = Yup.object({
  displayName: Yup.string()
    .min(3, "Must be at least 3 characters long")
    .max(12, "Must be 12 characters or less")
    .required("Must be at least 3 characters long"),
});
