import { createServer } from "https";

import { parse } from "url";

import next from "next";

import fs from "fs";

/************* THIS SERVER.TS file helps me mimic a https connection on localhost WHICH IS "https://localhost:4000" here
 * THIS IS NECESSARY for express session to set cookies on a browser
 * and I need to test all APIs on local before deploying hence I resorted to this
 * YOU CAN GENERATE your own localhost-key.pem and localhost.pem in ROOT DIRECTORY using mkcert (IF I DON'T PUSH TO PROD)
 * (mine is not available on the repo cause it's been included in the git ignore)
 * INSTALL mkcert on your device, go to https://github.com/FiloSottile/mkcert?tab=readme-ov-file
 * and run "mkcert -install" and "mkcert localhost" ON THE ROOT DIRECTORY OF THIS PROJECT
 * This gives you fake SSL keys to use and then run your next server using "npm run dev-https" already added to the package.json
 * NOTHING TOO COMPLEX RIGHT?
 * YH, EXPRESS SESSION AND RECENT BROWSER VERSIONS ARE TOO WOKE
 * FINALLY, THIS SERVER ONLY RUNS ON LOCAL if you have correctly set your NODE_ENV to "production" for deployment
 */

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

async function start() {
  await app.prepare();
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    handle(req, res, parsedUrl);
  }).listen(4000, () => {
    console.log("> ✅ Ready on https://localhost:4000");
  });
}

start();
