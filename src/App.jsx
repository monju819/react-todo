import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
