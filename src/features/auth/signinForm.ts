import * as Yup from "yup";

export interface SigninDetails {
  email: string;
  password: string;
}

export const initialValues: SigninDetails = {
  email: "",
  password: "",
};

export const signinSchema = Yup.object({
  password: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
});
