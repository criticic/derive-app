import "./App.css";
import { WindowTitlebar } from "tauri-controls";
import Home from "./pages/Home";
import { Routes, Route, useLocation } from 'react-router-dom';
import PaperInfo from "./pages/PaperInfo";
import { NavRoute } from "./components/NavRoute";

function App() {
  const location = useLocation();
  return (
    <div className="fixed flex flex-col w-full h-screen overflow-hidden rounded-lg">
      <WindowTitlebar className="h-10 bg-stone-50 w-full z-50 py-8 px-3 items-center text-sm" controlsOrder="left" windowControlsProps={{ platform: "macos" }}>
        <NavRoute />
      </WindowTitlebar>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/paper/:id" element={<PaperInfo />} />
      </Routes>
    </div>
  );
}

export default App;
