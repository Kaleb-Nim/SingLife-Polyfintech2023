import React from "react";
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

const fakeText = `
<div style="margin-bottom: 8px; font-weight:bold;">Further Reading:</div>
Travel Insurance: <br/>https://singlife.com/en/travel-insurance
<br />
<br />
Travel Coverage: <br/>https://singlife.com/en/form-library#&travel-insurance
<br />
<br />
Why you need to buy travel insurance:<br/> https://singlife.com/en/blog/money/2023/why-you-need-to-buy-travel-insurance
`;

const pipedText = `
<div style="margin-bottom: 8px; font-weight:bold;">Further Reading:</div>
Travel Insurance: <br/><a class="underline text-blue-500" href='https://singlife.com/en/travel-insurance'>https://singlife.com/en/travel-insurance</a>
<br />
<br />
Travel Coverage:<br/> <a class="underline text-blue-500" href='https://singlife.com/en/form-library#&travel-insurance'>https://singlife.com/en/form-library#&travel-insurance</a>
<br />
<br />
Why you need to buy travel insurance:<br/> <a class="underline text-blue-500" href='https://singlife.com/en/blog/money/2023/why-you-need-to-buy-travel-insurance'>https://singlife.com/en/blog/money/2023/why-you-need-to-buy-travel-insurance</a>
`;

const Prompt = () => {
  const [loading, setLoading] = React.useState(false);
  const [textContent, setTextContent] = React.useState("");
  const [input, setInput] = React.useState("");
  const getVideo = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setInput("");
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
    }, 35000);
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
  async function hitEndpoint() {
    setLoading(true);
    try {
      const endpoint = "http://0.0.0.0:8080/generate";
      await axios.post(endpoint, {
        input: input,
      });
    } catch (error) {
      console.error("endpoint error", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      id="prompt"
      className="flex items-center justify-center w-full h-screen translate-y-full"
    >
      <Card className="w-[40vw]">
        <CardHeader>
          <CardTitle>Enter a Prompt 🔥🚀</CardTitle>
          <CardDescription>
            Our state of the art AI will generate an informercial based on your
            prompt and the custom knowledge base from Singlife documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              hitEndpoint();
              getVideo();
            }}
          >
            <Input
              placeholder="Enter the user prompt"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
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

        {textContent && (
          <CardFooter>
            <div className="flex items-start">
              <video
                autoPlay
                controls
                src="/video1.mp4"
                className="h-[500px]"
              ></video>
              <div className="flex flex-col ml-6">
                <span className="text-sm text-gray-500">
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
                  className="mt-4 text-sm text-gray-500"
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
