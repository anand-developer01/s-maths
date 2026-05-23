import './App.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes";
import ScoreBoardProvider from './components/context/ScoreBoardContext';
function App() {

  return (
    <ScoreBoardProvider>
      <RouterProvider router={router} />
    </ScoreBoardProvider>
  )
}

export default App
