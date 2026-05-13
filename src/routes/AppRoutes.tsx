import { createHashRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ColorsLearning from "../components/colors/colorsLearning";
import Asmd from "../components/math/asmd/Asmd";
import NumberLearning from "../components/math/number/Numbers";
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
                path: "colors-learning",
                element: <ColorsLearning />,
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
                path: "number-learning",
                element: <NumberLearning />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);