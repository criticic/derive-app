import "./App.css";
import { WindowTitlebar } from "tauri-controls";
import Home from "./pages/Home";

function App() {
  return (
    <div className="fixed flex flex-col w-full h-screen overflow-hidden rounded-lg">
      <WindowTitlebar className="h-10 bg-stone-50 w-full z-50 py-8 px-3 items-center text-sm" controlsOrder="left" windowControlsProps={{ platform: "macos" }}>
        My Library
      </WindowTitlebar>
      <Home />
    </div>
  );
}

export default App;
