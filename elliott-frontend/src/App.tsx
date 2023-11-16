import Prompt from "./components/Prompt";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div id="body" className="min-h-[100svh] flex items-center">
      <div className="h-full flex flex-col p-3 mx-auto md:justify-center">
        <Prompt />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
