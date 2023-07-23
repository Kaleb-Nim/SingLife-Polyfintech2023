// Import pptxgenjs library
const pptxgen = require("pptxgenjs");
const { generateNumber } = require("./helper");
const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();

// Image Generation
async function createImage(text) {
  let data = {
    inputs: text,
  };
  const response = await fetch(
    "https://api-inference.huggingface.co/models/ducnapa/cute-cartoon-illustration",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return result;
}

// Template Generator Functions
//Template 1
async function template1(postsArr, save_name, pptx) {
  if (!save_name.includes("pptx")) {
    return { type: "error", message: "save_name is not pptx" };
  }
  for (let post of postsArr) {
    let slide = pptx.addSlide();
    if ("title" in post && "content" in post) {
      // Means it is cover page
    } else if ("title" in post && "callToAction" in post) {
      //Means it is end page
    } else {
      // Means normal page
      slide.background = { color: "afece5" };

      let res = await createImage(post["image"] + ". zoomed out");
      // let res = await createImage(
      //   "A group of friends celebrating at a wedding"
      // );
      let arrayBuffer = await res.arrayBuffer();
      await fs.promises.writeFile(
        `./${post["image"].replaceAll(" ", "_")}.jpg`,
        Buffer.from(arrayBuffer),
        (error) => {
          console.log(error);
        }
      );

      await slide.addImage({
        x: "0%",
        w: "100%",
        y: "25%",
        h: `100%`,
        path: `./${post["image"].replaceAll(" ", "_")}.jpg`,
        sizing: {
          type: "crop",
          h: `${(2 / 3) * 100 - 25}%`,
          y: "15%",
        },
      });

      await slide.addText(post["heading"], {
        x: "0%",
        y: "10%",
        w: "100%",
        h: "10%",
        fontSize: 50,
        color: "e41b2f",
        align: "center",
        fontFace: "Open Sans",
        bold: true,
      });

      let textY = (2 / 3) * 100;
      let textBGHeight = 100 - textY;
      await slide.addShape(pptx.ShapeType.rect, {
        x: "0%",
        y: `${textY}%`,
        w: "100%",
        h: `${textBGHeight}%`,
        valign: "top",
        fill: { color: "008572" },
      });

      let textWidth = 80;
      let textX = (100 - textWidth) / 2;
      let subHeadingSize = 36;
      let bodySize = 26;
      await slide.addText(
        [
          {
            text: "\n",
            options: { fontSize: 14 },
          },
          {
            text: post["subheading"],
            options: { bold: true, fontSize: subHeadingSize },
          },
          {
            text: "\n\n",
            options: { fontSize: 14 },
          },
          {
            text: post["content"],
            options: { fontSize: bodySize },
          },
        ],
        {
          x: `${textX}%`,
          y: `${textY}%`,
          w: `${textWidth}%`,
          h: `${(textBGHeight * 75) / 100}%`,
          color: "FFFFFF",
          align: "left",
          fontFace: "Open Sans",
          valign: "top",
        }
      );
    }
  }
  pptx.writeFile({ fileName: save_name });
  for (let post of postsArr) {
    if ("title" in post && "content" in post) {
    } else if ("title" in post && "callToAction" in post) {
    } else {
      await fs.promises.unlink(`./${post["image"].replaceAll(" ", "_")}.jpg`);
    }
  }
  return { type: "log", message: `Post generated and saved at ${save_name}` };
}

let templates = [template1];

async function createPost(promptObj, save_name = "test.pptx") {
  let postsArr = promptObj["posts"];
  let pptx = new pptxgen();
  // Configure the presentation slide
  pptx.defineLayout({ name: "Post", width: 11.25, height: 11.25 });
  pptx.layout = "Post";
  let { type, message } = await templates[generateNumber(templates.length)](
    postsArr,
    save_name,
    pptx
  );
  console[type](message);
}

let promptObj = {
  posts: [
    {
      title: "Have you celebrated these milestones with your army mates?",
      content:
        "Maximise the benefits of the MINDEF Group Insurance with them as well!",
      image: "A group of army men taking a selfie together",
    },
    {
      heading: "Celebrating a job promotion",
      subheading: "Give your MINDEF Group Term Life Insurance a promotion.",
      content:
        "Promote your Core Scheme to a Voluntary Scheme too, at only S$0.83/day for up to S$1 million cover.",
      image: "A group of friends celebrating over dinner with drinks",
    },
    {
      heading: "Venturing overseas for a reunion",
      subheading: "Get more injury cover for less.",
      content:
        "Fly with ease knowing you can upsize your Group Personal Injury coverage. It's only S$0.17/day for up to S$1 million for 24/7 worldwide protection against mishaps.",
      image: "A group of friends on a overseas holiday ski trip on mountain",
    },
    {
      heading: "Getting married",
      subheading: "Have your new family covered as well.",
      content:
        "We'll offer your spouse (and any children) the same coverage as you have at a matched cost.",
      image: "A group of friends celebrating at a wedding with a couple in the middle",
    },
    {
      title: "If you're NOT on the MINDEF Voluntary Scheme yet...",
      callToAction: `Why miss out?\nGet a quote through our website\n(Yes, even if you've already ORD-ed!)`,
      button: "Simply click on the linkin.bio!",
      image: "An army men panicking",
    },
  ],
  caption: `Having been through thick and thin together, it's no wonder the friends you make in NS stay with you for life 👊🏽\n\nJust like how you celebrate milestones with your army buddies, the MINDEF Group Insurance you have can follow you through life too, covering you as your assets grow and you have more people to care for.\n\nSwipe to see how you can maximise your MINDEF Group Insurance Voluntary Scheme through life's many joys. \n\nTap the linkin.bio to learn how you can get the most affordable term life and personal injury rates in the market. \n\n#mindef #mha #singlife #termlife #personalaccident #personalinjury #armybros\n\nT&Cs apply.\nProtected up to specified limits by SDIC.`,
};

createPost(promptObj, "test.pptx");
