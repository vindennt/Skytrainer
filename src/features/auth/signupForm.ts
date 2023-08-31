import * as Yup from "yup";

export interface SignupDetails {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const initialValues: SignupDetails = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const signupSchema = Yup.object({
  displayName: Yup.string()
    .min(3, "Must be at least 3 characters long")
    .max(12, "Must be 12 characters or less")
    .required("Required"),
  password: Yup.string()
    .min(6, "Must contain minimum 6 characters")
    .max(15, "Must contain maximum 15 characters")
    // must contain at least one number and one uppercase, and 6 characters long.
    .matches(
      /(?=.*[A-Z])(?=.*\d).{6,}$/,
      "Must contain 1 number and 1 uppercase letter"
    )
    .required("Required"),
  confirmPassword: Yup.string()
    .min(6, "Must contain minimum 6 characters")
    .max(15, "Must contain maximum 15 characters")
    .oneOf([Yup.ref("password")], "The passwords must match")
    .required("The passwords must match"),
  email: Yup.string().email("Invalid email address").required("Required"),
});
