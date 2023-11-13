import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChevronRight, Facebook, Instagram, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import TypewriterMarkdown from "./Typewriter";

import useAutosizeTextArea from "./ui/useAutosizeTextArea";

interface Source {
  url: string;
  title: string;
}

interface Scene {
  scene: string;
  subtitles: string[];
}

const Prompt = () => {
  const [loading, setLoading] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [concerns, setConcerns] = useState<string>("");
  const [needs, setNeeds] = useState<string>("");
  const [lifestyle, setLifestyle] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaNeedsRef = useRef<HTMLTextAreaElement>(null);
  const textAreaLifestyleRef = useRef<HTMLTextAreaElement>(null);

  const [videoSource, _] = useState<string>("./Singlife SFF Demo Full.mp4");

  useAutosizeTextArea(textAreaRef.current, concerns);
  useAutosizeTextArea(textAreaNeedsRef.current, needs);
  useAutosizeTextArea(textAreaLifestyleRef.current, lifestyle);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = evt.target;
    setConcerns(value);
  };

  const handleNeedsChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = evt.target;
    setNeeds(value);
  };

  const handleLifestyleChange = (
    evt: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = evt.target;
    setLifestyle(value);
  };

  const handleAgeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = evt.target.value;

    // Check if the entered value is a valid number
    if (!isNaN(Number(inputValue))) {
      setAge(inputValue);
    } else {
      // If not a valid number, set age to an empty string
      setAge("");
    }
  };

  const formatSources = async (rawSource: Source[]) => {
    let output: string[] = [];
    output.push(`**Sources:**`);

    rawSource.forEach(async (e: Source) => {
      output.push(`${e.title}:`);
      output.push(`[${e.url}](${e.url})`);
    });
    return setTextContent(output.join("\n\n"));
  };

  async function generateVideo(scenesList: Scene) {
    console.log(scenesList);
    return;
  }

  const hitEndpoint = async () => {
    setLoading(true);
    setTextContent("");
    try {
      if (!name && !concerns) {
        alert("Missing Input Values!");
        setLoading(false);
        return;
      }
      let response = await axios.post(
        `${import.meta.env.VITE_BACKEND_FASTAPI}/query`,
        {
          name,
          age: parseInt(age),
          needs,
          lifestyle,
          concerns,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      console.log(response.data.sources);
      await formatSources(response.data.sources);
      await generateVideo(response.data.video_script.list_of_scenes);
      setLoading(false);
      return response;
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const { toast } = useToast();
  function copyLink(link: string) {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      variant: "success",
      description: "You may now share this link with others!",
    });
  }

  return (
    <div id="prompt" className="flex justify-center w-full h-fit">
      <Card className="min-w-[350px] flex mx-auto max-w-[750px] flex-col md:flex-row">
        <div className="min-w-[350px] max-w-[350px] w-full">
          <CardHeader>
            <CardTitle>SINGen - Generate Infomercial</CardTitle>
            <CardDescription>
              Our state of the art AI will generate an infomercial based on your
              prompt and the custom knowledge base from Singlife documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col items-start justify-start gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                hitEndpoint();
                // getVideo();
              }}
            >
              <Input
                placeholder="Name of Client"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Input
                placeholder="Age of Client (Optional)"
                type="number"
                value={age}
                onChange={handleAgeChange}
              />
              <textarea
                id="prompt-text"
                className="max-h-[150px] resize-none flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={handleChange}
                placeholder="Concerns"
                ref={textAreaRef}
                rows={1}
                value={concerns}
              />
              <textarea
                id="prompt-text"
                className="max-h-[150px] resize-none flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={handleNeedsChange}
                placeholder="Needs (Optional)"
                ref={textAreaNeedsRef}
                rows={1}
                value={needs}
              />
              <textarea
                id="prompt-text"
                className="max-h-[150px] resize-none flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={handleLifestyleChange}
                placeholder="Lifestyle (Optional)"
                ref={textAreaLifestyleRef}
                rows={1}
                value={lifestyle}
              />

              <Button disabled={loading} className="mt-4" type="submit">
                {loading && <Loader2 className="mr-2 animate-spin" />}
                Generate
                {!loading && <ChevronRight />}
              </Button>
              {loading && (
                <div className="mt-2 text-sm font-normal text-slate-400">
                  Video is being generated... this may take a few minutes...
                </div>
              )}
            </form>
          </CardContent>
        </div>

        {textContent && (
          <CardFooter className="p-6 w-screen">
            <div className="flex items-start w-full flex-col">
              <div className="w-full aspect-video">
                <video
                  autoPlay
                  controls
                  src={videoSource}
                  className="w-full aspect-video"
                ></video>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-bold mt-4">
                  Share with others:
                </span>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={"outline"}
                    onClick={() => copyLink(videoSource)}
                  >
                    <Facebook className="text-blue-600" />
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => copyLink(videoSource)}
                  >
                    <img
                      src="/whatsapp.png"
                      alt="whatsapp"
                      className="w-6 h-6"
                    />
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => copyLink(videoSource)}
                  >
                    <Instagram className="text-purple-500" />
                  </Button>
                </div>
                <div id="markdownContainer">
                  <TypewriterMarkdown markdownText={textContent} />
                </div>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Prompt;
