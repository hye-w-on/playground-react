import React from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";

function RegisterPage(props) {
  const dispatch = useDispatch();
  /*const formik = useFormik({
    initialValues: {
      Email: "",
      Name: "",
      Password: "",
      ConfirmPassword: "",
    },
    validationSchema: Yup.object({
      Email: Yup.string()
        .email("Invalid email address")
        .required("Email Required"),
      Name: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Name Required"),
    }),
    onSubmit: (values) => {
      let body = {
        email: Email,
        name: Name,
        password: Password,
      };
      //Axios.post("api/users/register", body).then((response) => {});
      dispatch(registerUser(body)).then((response) => {
        if (response.payload.success) {
          props.history.push("/login");
        } else {
          setFormErrorMessage("Fail to sign up");
        }
      });
    },
  });*/
  return (
    <Formik
      initialValues={{
        Email: "",
        name: "",
        Password: "",
        ConfirmPassword: "",
      }}
      validationSchema={Yup.object({
        Email: Yup.string()
          .email("Invalid email address")
          .required("Email Required"),
        Name: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Name Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let body = {
            email: values.email,
            name: values.name,
            password: values.Password,
          };
          //Axios.post("api/users/register", body).then((response) => {});
          dispatch(registerUser(body)).then((response) => {
            if (response.payload.success) {
              props.history.push("/login");
            } else {
              //setFormErrorMessage("Fail to sign up");
            }
          });

          setSubmitting(false);
        }, 400);
      }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (
          <div>
            login
            <form
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={handleSubmit}
            >
              <label>Email</label>
              <input
                id="Email"
                type="text"
                value={values.Email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label>Name</label>
              <input
                id="Name"
                type="text"
                value={values.Name}
                onChange={handleChange}
              />
              <label>Password</label>
              <input
                id="Password"
                type="password"
                value={values.Password}
                onChange={handleChange}
              />
              <label>ConfirmPassword</label>
              <input
                id="ConfirmPassword"
                type="password"
                value={values.ConfirmPassword}
                onChange={handleChange}
              />
              <br />
              <button
                onClick={handleSubmit}
                type="primary"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </form>
          </div>
        );
      }}
    </Formik>
  );
}

export default RegisterPage;
