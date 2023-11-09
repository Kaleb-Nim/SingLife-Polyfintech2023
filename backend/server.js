const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).send("Server Working!")
})

app.get("/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Transfer-Encoding": "chunked",
    "X-Content-Type-Options": "nosniff",
  });

  const interval = setInterval(() => {
    const data1 = Math.random().toString(36).substring(2, 8);
    const data2 = Math.random().toString(36).substring(2, 8);
    res.write(`${data1} ${data2}`);
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    res.end();
  }, 10000);
});

const port = process.env.PORT || 3000 ; // Set the desired port number
app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
});
