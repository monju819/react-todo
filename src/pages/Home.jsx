import React, { useEffect, useState } from "react";

import {
  getStorage,
  ref as imgref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  getDatabase,
  push,
  ref,
  set,
  onValue,
  remove,
  update,
} from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { activeUser } from "../slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [values, setValues] = useState({
    tname: "",
    tdes: "",
  });
  const [tasklist, setTasklist] = useState([]);
  const [id, setId] = useState("");
  const [file, setFile] = useState(null);
  const storage = getStorage();
  const db = getDatabase();
  const username = "John Doe";

  let userInfo = useSelector((state) => state.activeUser.value);
  console.log(userInfo);
  let dispatch = useDispatch();
  const auth = getAuth();
  let navigate = useNavigate();
  let handleLogOut = () => {
    signOut(auth).then(() => {
      dispatch(activeUser(null));
      localStorage.removeItem("user");
      navigate("/login");
    });
  };

  let handleImageupload = (e) => {
    let selectedFile = e.target.files[0];
    console.log(selectedFile);
    let formetTypes = ["image/jpeg", "image/png"];
    if (selectedFile && formetTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      console.log("upload file", selectedFile);
    } else {
      console.log("Please select a valid image file (JPEG or PNG)");
    }

    const storageRef = imgref(storage, selectedFile.name);
    uploadBytes(storageRef, selectedFile).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        console.log("File available at", downloadURL);
      });
    });
  };

  let handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const handleAddTaskClick = () => {
    setShowUpdateButton(true);

    if (file) {
      const storageRef = imgref(storage, file.name);
      uploadBytes(storageRef, file)
        .then((snapshot) => getDownloadURL(storageRef))
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          set(push(ref(db, "todo")), {
            taskName: values.tname,
            taskdes: values.tdes,
            img: downloadURL,
          });
        })
        .catch((error) => {
          console.error("Error uploading image: ", error);
        });
    } else {
      console.log("Please upload an image");
    }
  };
  // console.log(values.tname);
  // console.log(values.tdes);
  // set(push(ref(db, "todo")), {
  //   taskName: values.tname,
  //   taskdes: values.tdes,

  // });

  useEffect(() => {
    const todoRef = ref(db, "todo");
    onValue(todoRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), id: item.key });
      });
      setTasklist(arr);
    });
  }, []);

  let handleDelete = (id) => {
    remove(ref(db, "todo/" + id));
  };

  let handleEdit = (item) => {
    setValues({
      tname: item.taskName,
      tdes: item.taskdes,
    });
    setId(item.id);
  };
  let handleUpdate = () => {
    update(ref(db, "todo/" + id), {
      taskName: values.tname,
      taskdes: values.tdes,
    });
  };

  return (
    <>
      <nav className="flex justify-between items-center bg-gray-200 p-4">
        <p>Welcome, {userInfo.displayName}</p>
        <button
          onClick={handleLogOut}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Logout
        </button>
      </nav>

      <div className="container mx-auto mt-8">
        <h1 className="text-4xl font-bold mb-4">Todo List</h1>
        <div className="flex">
          <input
            name="tname"
            value={values.tname}
            type="text"
            className="border p-2 mr-2"
            placeholder="Add a new task"
            onChange={handleChange}
          />
          <input
            name="tdes"
            value={values.tdes}
            type="text"
            className="border p-2 mr-2"
            placeholder="Add a new task description"
            onChange={handleChange}
          />
          <button className="bg-blue-500 text-white px-4 py-2 mr-2">
            <label>
              <input type="file" hidden onChange={handleImageupload} />
              Upload Image
            </label>
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 "
            onClick={handleAddTaskClick}
          >
            Add Task
          </button>
          {showUpdateButton && (
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 ml-2"
            >
              Update
            </button>
          )}
        </div>
        <ul className="flex mt-4 w-[600px] flex-col">
          {tasklist.map((item) => (
            <li className="border p-2 mt-2 flex justify-between  items-center">
              <div>
                <img
                  src={item.img}
                  alt=""
                  className="w-[100px] h-[100px] object-cover "
                />
              </div>
              <div>
                {item.taskName}--{item.taskdes}{" "}
              </div>
              <div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 "
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 ml-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Home;
