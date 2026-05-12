import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
// import Learn from "../pages/Learn";
// import Practice from "../pages/Practice";
import NotFound from "../pages/NotFound";
import LineMultiplication from "../components/line-multiplication/LineMultiplication";
import Asmd from "../components/math/asmd/Asmd";
import LineMathPractice from "../components/line-multiplication/LineMathPractice";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "line-multiplication",
                element: <LineMultiplication />
            },
            {
                path: "asmd-game",
                element: <Asmd />
            },
            {
                path: "line-math-practice",
                element: <LineMathPractice />
            }
            //   {
            //     path: "practice",
            //     element: <Practice />,
            //   },
        ],
    },

    {
        path: "*",
        element: <NotFound />,
    },
]);