/*
 * File: server.js
 * Project: parteiduell
 * File Created: Wednesday, 4th December 2019 1:10:21 am
 * Author: Nico Finkernagel <nico@gruselhaus.com>
 * -----
 * Last Modified: Sunday, 8th December 2019 4:18:20 pm
 * Modified By: Nico Finkernagel <nico@gruselhaus.com>
 * -----
 */

require("dotenv").config();
const express = require("express");
const server = express();

const cors = require("cors");
server.use(cors());

const request = require("request-promise");

//Get latest commit from the frontend repository.
server.get("/version", async (_, res) => {
  try {
    const resp = await request.get(
      "https://api.github.com/repos/Parteiduell/frontend/commits/master",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36"
        }
      }
    );
    const parsed = JSON.parse(resp);
    res.status(200).json({
      lastCommit: {
        sha: parsed.sha,
        commit: { author: parsed.commit.author }
      }
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send(`An error ocurred: ${err.response}`);
    return;
  }
});

server.get("/ping", (_, res) => {
  res.send("Pong!");
});

//React App Build
server.use(express.static("build"));

//If requested path is not available redirect to root
server.get("*", (_, res) => {
  res.redirect("/");
});

//Server Stuff
const getPort = () => {
  if (process.env.MODE == "production") return process.env.PRODUCTION_PORT;
  else if (process.env.MODE == "staging") return process.env.STAGING_PORT;
  else return 4000;
};

const PORT = getPort();
server.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
