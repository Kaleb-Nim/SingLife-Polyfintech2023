import Prompt from "./components/Prompt";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div id="body">
      <div className="h-[100svh] flex flex-col p-3 mx-auto md:justify-center">
        <Prompt />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
