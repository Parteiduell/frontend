const express = require("express");
const server = express();

const cors = require("cors");
server.use(cors());

server.use(express.static("build"));

const request = require("request-promise");

server.get("/version", async (_, res) => {
  try {
    const resp = await request.get("https://api.github.com/repos/jugendhackt/parteiduell-frontend/commits/master", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36"
      }
    });
    const parsed = JSON.parse(resp);
    res.status(200).json({ lastCommit: { sha: parsed.sha, commit: { author: parsed.commit.author } } });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send(`An error ocurred: ${err.response}`);
    return;
  }
});

server.listen(process.env.PORT || 4000, () => console.log(`Server started at port: ${process.env.PORT || 4000}`));
