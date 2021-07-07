import express, { Request, Response } from "express";
import register from "@react-ssr/express/register";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

const fetchURL = "https://youtube-give-videos.herokuapp.com";

(async () => {
  try {
    await register(app);
  } catch (e) {}

  app.get("/", async (_req: Request, res: Response) => {
    res.render("index", {
      fetchURL,
      videos: [
        ...(await fetch(fetchURL + "/videos?amount=100").then((res) =>
          res.json()
        )),
      ],
    });
  });

  app.listen(PORT, () => {
    console.log("> Ready on http://localhost:3000");
  });
})();
