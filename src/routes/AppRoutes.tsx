import { createHashRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ColorsLearning from "../components/colors/colorsLearning";
import Asmd from "../components/math/asmd/Asmd";
import NumberLearning from "../components/math/number/Numbers";
import AZGrid from "../components/alphabet/AZGrid";
import Handwriting from "../components/handwriting/Handwriting";
import KidDrawingApp from "../components/drawing/DrawingApp";
import Login from "../components/kid/Login";
import Register from "../components/kid/Register";
import AtoZBubbleGame from '../components/alphabet/AtoZBubbleGame';
import AlphabetPhonicsQuiz from '../components/alphabet/AlphabetPhonicsQuiz'
import PhonicsTypingQuiz from '../components/alphabet/PhonicsTypingQuiz'
import ArrowMazeGame from "../components/line-drawing-larning/ArrowGame";
import LineLearningGame from "../components/line-drawing-larning/LineLearningPractice";

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
                path: "hand-writing",
                element: <Handwriting />,
            },
            {
                path: "number-learning",
                element: <NumberLearning />,
            },
            {
                path: "drawing",
                element: <KidDrawingApp />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "A-Z-Bubble-Game",
                element: <AtoZBubbleGame />,
            },
            {
                path: "Alphabet-Phonics-Quiz",
                element: <AlphabetPhonicsQuiz />,
            },
            {
                path: "Phonics-Typing-Quiz",
                element: <PhonicsTypingQuiz />,
            },
            {
                path: "Arrow-Game",
                element: <ArrowMazeGame />,
            },
            {
                path: "Line-Learning",
                element: <LineLearningGame />,
            },


        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);