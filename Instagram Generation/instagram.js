// Import pptxgenjs library
const pptxgen = require("pptxgenjs");

// Create a presentation slide
let pptx = new pptxgen();

// Configure the presentation slide
pptx.defineLayout({ name: "Post", width: 11.25, height: 11.25 });
pptx.layout = "Post";

// Add a slide
let slide = pptx.addSlide();

slide.background = { color: "afece5" };

// Template 1
slide.addImage({
  x: "0%",
  w: "100%",
  y: "15%",
  h: `${(2 / 3) * 100 - 15}%`,
  path: "./dinner.png",
});

slide.addText("Celebrating a job promotion", {
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
slide.addShape(pptx.ShapeType.rect, {
  x: "0%",
  y: `${textY}%`,
  w: "100%",
  h: `${textBGHeight}%`,
  fill: { color: "008572" },
});

let textWidth = 80;
let textX = (100 - textWidth) / 2;
let subHeadingSize = 36;
let bodySize = 26;
slide.addText(
  [
    {
      text: "Give your MINDEF Group Term Life Insurance a protection.\n",
      options: { bold: true, fontSize: subHeadingSize },
    },
    {
      text: "Promote your Core Scheme to a Voluntary Scheme too, at only S$0.83/day for up to S$1 million cover.",
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
  }
);

// Save the Presentation
pptx.writeFile({ fileName: "Template 1.pptx" });
