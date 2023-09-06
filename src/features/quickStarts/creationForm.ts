import * as Yup from "yup";

export interface SignupDetails {
  name: string;
  duration: number;
  //   station: string;
}

export const quickstartSchema = Yup.object({
  name: Yup.string()
    .min(1, "Must be at least 1 character long")
    .max(10, "Must be 10 characters or less")
    .required("Required"),
  duration: Yup.string()
    .required("Required")
    .matches(/^(?!0).*/, "Should not be zero"),
  //   station: Yup.string().required("Required"),
});
