import { createHashRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import LineMultiplication from "../components/line-multiplication/LineMultiplication";
import Asmd from "../components/math/asmd/Asmd";
import LineMathPractice from "../components/line-multiplication/LineMathPractice";
import AZGrid from "../components/alphabet/AZGrid";

export const router = createHashRouter([
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
                element: <LineMultiplication />,
            },
            {
                path: "asmd-game",
                element: <Asmd />,
            },
            {
                path: "alphabet",
                element: <AZGrid />,
            },
            {
                path: "line-math-practice",
                element: <LineMathPractice />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);