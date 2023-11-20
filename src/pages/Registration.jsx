import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Registration() {
  const auth = getAuth();
  let navigate = useNavigate();
  let [taskdata, setTaskdata] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  let [fullnameError, setFullnameError] = useState("");
  let [emailError, setEmailError] = useState("");
  let [passwordError, setPasswordError] = useState("");

  let handleChange = (e) => {
    setTaskdata({
      ...taskdata,
      [e.target.name]: e.target.value,
    });
    setFullnameError("");
    setEmailError("");
    setPasswordError("");
  };

  let handleRegister = () => {
    if (!taskdata.fullname) {
      setFullnameError("Please Enter Your Fullname");
    }
    if (!taskdata.email) {
      setEmailError("Please enter valid email address");
    }
    if (!taskdata.password) {
      setPasswordError("Please enter valid password");
    }

    if (taskdata.fullname && taskdata.email && taskdata.password) {
      let pattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!pattern.test(taskdata.email)) {
        setEmailError("invalid Email");
      }
      if (taskdata.fullname.trim().length === 0) {
        setFullnameError("Please enter a valid name ");
      }
      if (!re.test(taskdata.password)) {
        setPasswordError("invaild Password");
      }
    }
    console.log("Registration done");

    createUserWithEmailAndPassword(auth, taskdata.email, taskdata.password)
      .then((user) => {
        updateProfile(auth.currentUser, {
          displayName: taskdata.fullname,
        });
      })
      .then(() => {
        sendEmailVerification(auth.currentUser).then(() => {
          // Email verification sent!
          // ...
          setTaskdata({
            fullname: "",
            email: "",
            password: "",
          });

          setTimeout(() => {
            navigate("/login");
          }, 1000);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode.includes("email")) {
          setEmailError("Email already in use");
        }
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <div className="container mx-auto mt-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-4">Registration</h1>
      <input
        onChange={handleChange}
        name="fullname"
        value={taskdata.fullname}
        type="text"
        placeholder="FullName"
        className="border p-2 mb-2 w-96"
      />
      {fullnameError && <p className="text-red-500 text-sm">{fullnameError}</p>}
      <input
        onChange={handleChange}
        value={taskdata.email}
        name="email"
        type="email"
        placeholder="Email"
        className="border p-2 mb-2 w-96"
      />
      {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
      <input
        onChange={handleChange}
        name="password"
        value={taskdata.password}
        type="password"
        placeholder="Password"
        className="border p-2 mb-2 w-96"
      />
      {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
      <div className=" w-96 flex  justify-center">
        <button
          onClick={handleRegister}
          className="bg-blue-500 text-white px-4 py-2 "
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Registration;
