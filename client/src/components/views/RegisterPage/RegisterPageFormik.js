import React from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import "./RegisterPage.css";
import moment from "moment";

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
        Name: "",
        Password: "",
        ConfirmPassword: "",
      }}
      validationSchema={Yup.object({
        Email: Yup.string()
          .email("Invalid email address")
          .required("Email is required"),
        Name: Yup.string().required("Name is required"),
        Password: Yup.string()
          .min(4, "Password must be at least 4 characters")
          .required("Password is required"),
        ConfirmPassword: Yup.string()
          .oneOf([Yup.ref("Password"), null], "Passwords must match")
          .required("Confirm Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let body = {
            email: values.Email,
            name: values.Name,
            password: values.Password,
            image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`,
          };
          dispatch(registerUser(body)).then((response) => {
            if (response.payload.success) {
              props.history.push("/login");
            } else {
              alert(response.payload.err.errmsg);
              //setFormErrorMessage("Fail to sign up");
            }
          });

          setSubmitting(false);
        }, 500);
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
          <div className="register-container">
            Create your account
            <form onSubmit={handleSubmit}>
              <label>Email</label>
              <input
                id="Email"
                type="text"
                value={values.Email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.Email && touched.Email && (
                <div className="validation">{errors.Email}</div>
              )}
              <label>Name</label>
              <input
                id="Name"
                type="text"
                value={values.Name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.Name && touched.Name && (
                <div className="validation">{errors.Name}</div>
              )}
              <label>Password</label>
              <input
                id="Password"
                type="password"
                value={values.Password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.Password && touched.Password && (
                <div className="validation">{errors.Password}</div>
              )}
              <label>ConfirmPassword</label>
              <input
                id="ConfirmPassword"
                type="password"
                value={values.ConfirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.ConfirmPassword && touched.ConfirmPassword && (
                <div className="validation">{errors.ConfirmPassword}</div>
              )}
              <br />
              <button type="submit">Submit</button>
            </form>
          </div>
        );
      }}
    </Formik>
  );
}

export default RegisterPage;
