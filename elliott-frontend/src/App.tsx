import Prompt from "./components/Prompt";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div className="absolute left-1/2 top-1/2 z-[4] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 px-4 text-center">
        <h1 className="inline-block text-4xl font-black md:text-6xl lg:text-7xl">
          <span className="inline-block bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent whitespace-nowrap">
            SINGen Polyfintech 2023
          </span>
        </h1>
        <h2 className="max-w-md text-2xl font-bold md:text-3xl lg:max-w-2xl lg:text-5xl">
          Unleash the{" "}
          <span className="decoration-3 underline decoration-yellow-500 decoration-dashed underline-offset-2">
            Power of AI
          </span>{" "}
          in Insurance Knowledge
        </h2>
        <p className="text max-w-[500px] opacity-90 lg:max-w-[600px] lg:text-xl">
          An infomercial (video) generation system that utilises Singlife's data
          to deliver personalised and engaging content.
        </p>
        <a
          href="#prompt"
          className="cursor-pointer rounded bg-red-500 px-4 py-2 font-extrabold uppercase text-white"
        >
          Get Started
        </a>
      </div>
      <Prompt />
      <Toaster />
    </>
  );
}

export default App;
