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
// import axios from "axios";

import useAutosizeTextArea from "./ui/useAutosizeTextArea";

const fakeText = `
<div style="margin-bottom: 8px; font-weight:bold;">Sources:</div>
your-guide-to-life-insurance-english: <br/>https://singlife.com/content/dam/public/sg/documents/consumer-guides/your-guide-to-life-insurance-english.pdf
<br />
<br />
your-guide-to-life-insurance: <br/>https://singlife.com/content/dam/public/sg/documents/documents/your-guide-to-life-insurance.pdf
<br />
<br />
YGTHI_Chinese:<br/> https://singlife.com/content/dam/public/sg/documents/consumer-guides/YGTHI_Chinese.pdf
`;

const pipedText = `
<div style="margin-bottom: 8px; font-weight:bold;">Sources:</div>
your-guide-to-life-insurance-english: <br/><a target="_blank" class="underline text-blue-500" href='https://singlife.com/content/dam/public/sg/documents/consumer-guides/your-guide-to-life-insurance-english.pdf'>https://singlife.com/content/dam/public/sg/documents/consumer-guides/your-guide-to-life-insurance-english.pdf</a>
<br />
<br />
your-guide-to-life-insurance:<br/> <a target="_blank" class="underline text-blue-500" href='https://singlife.com/content/dam/public/sg/documents/documents/your-guide-to-life-insurance.pdf'>https://singlife.com/content/dam/public/sg/documents/documents/your-guide-to-life-insurance.pdf</a>
<br />
<br />
YGTHI_Chinese:<br/> <a target="_blank" class="underline text-blue-500" href='https://singlife.com/content/dam/public/sg/documents/consumer-guides/YGTHI_Chinese.pdf'>https://singlife.com/content/dam/public/sg/documents/consumer-guides/YGTHI_Chinese.pdf</a>
`;

const Prompt = () => {
  const [loading, setLoading] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<Number | string>("");
  const [value, setValue] = useState<string>("");
  const [needs, setNeeds] = useState<string>("");
  const [lifestyle, setLifestyle] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaNeedsRef = useRef<HTMLTextAreaElement>(null);
  const textAreaLifestyleRef = useRef<HTMLTextAreaElement>(null);

  const [source, setSource] = useState<string>("");

  useAutosizeTextArea(textAreaRef.current, value);
  useAutosizeTextArea(textAreaNeedsRef.current, needs);
  useAutosizeTextArea(textAreaLifestyleRef.current, lifestyle);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setValue(val);
  };

  const handleNeedsChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setNeeds(val);
  };

  const handleLifestyleChange = (
    evt: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const val = evt.target?.value;
    setLifestyle(val);
  };

  const getVideo = async () => {
    setLoading(true);
    if (!name && !value) {
      setTimeout(() => {
        setLoading(false);
      }, 100);
      return;
    }
    setLoading(true);
    setSource("");
    setTimeout(() => {
      setSource("./Singlife SFF Demo Full.mp4");
    }, 6500);
    setTimeout(() => {
      setLoading(false);
      // setInput("");
      // create text streaming effect
      let i = 0;
      const interval = setInterval(() => {
        setTextContent(fakeText.slice(0, i));
        i++;
        if (i > fakeText.length) {
          clearInterval(interval);
          setTextContent(pipedText);
        }
      }, 12);
    }, 1000);
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
  // async function hitEndpoint() {
  //   if (name && value) {
  //     return;
  //   }
  //   setLoading(true);
  //   setSource("");
  //   try {
  //     const endpoint = "./vite.svg";
  //     await axios.post(endpoint, {
  //       // input: input,
  //     });
  //   } catch (error) {
  //     console.error("endpoint error", error);
  //   } finally {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 1000);
  //   }
  // }
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
                // hitEndpoint();
                getVideo();
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
                value={age?.toString()}
                onChange={(e) => {
                  setAge(e.target.value);
                }}
              />
              <textarea
                id="prompt-text"
                className="max-h-[150px] resize-none flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={handleChange}
                placeholder="Concerns"
                ref={textAreaRef}
                rows={1}
                value={value}
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
          <CardFooter className="p-6 w-full">
            <div className="flex items-start w-full flex-col">
              <div className="w-full aspect-video">
                <video
                  autoPlay
                  controls
                  src={source}
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
                    onClick={() => copyLink("https://imgur.com/xSnj7KR.mp4")}
                  >
                    <Facebook className="text-blue-600" />
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => copyLink("https://imgur.com/xSnj7KR.mp4")}
                  >
                    <img
                      src="/whatsapp.png"
                      alt="whatsap"
                      className="w-6 h-6"
                    />
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => copyLink("https://imgur.com/xSnj7KR.mp4")}
                  >
                    <Instagram className="text-purple-500" />
                  </Button>
                </div>
                <p
                  dangerouslySetInnerHTML={{ __html: textContent }}
                  className="mt-4 text-sm text-gray-500 break-all"
                ></p>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Prompt;
