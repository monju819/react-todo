import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { activeUser } from "../slices/userSlice";
import { useDispatch } from "react-redux";

function Login() {
  const auth = getAuth();

  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [taskdata, setTaskdata] = useState({
    email: "",
    password: "",
  });

  let [emailError, setEmailError] = useState("");
  let [passwordError, setPasswordError] = useState("");

  let handleChange = (e) => {
    setTaskdata({
      ...taskdata,
      [e.target.name]: e.target.value,
    });

    setEmailError("");
    setPasswordError("");
  };

  let handleRegister = () => {
    if (!taskdata.email) {
      setEmailError("Please enter valid email address");
    }
    if (!taskdata.password) {
      setPasswordError("Please enter valid password");
    }

    if (taskdata.email && taskdata.password) {
      let pattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!pattern.test(taskdata.email)) {
        setEmailError("invalid Email");
      }

      if (!re.test(taskdata.password)) {
        setPasswordError("invaild Password");
      }
    }
    console.log("Registration done");
    signInWithEmailAndPassword(auth, taskdata.email, taskdata.password).then(
      (user) => {
        navigate("/home");
        dispatch(activeUser(user.user));
        localStorage.setItem("user", JSON.stringify(user.user));
      }
    );
  };

  return (
    <div className="container mx-auto mt-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-4">Registration</h1>

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
          {" "}
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
