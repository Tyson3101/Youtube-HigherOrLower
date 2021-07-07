"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_1 = __importDefault(require("@react-ssr/express/register"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const app = express_1.default();
const PORT = process.env.PORT || 3000;
const fetchURL = "https://youtube-give-videos.herokuapp.com";
(async () => {
    try {
        await register_1.default(app);
    }
    catch (e) { }
    app.get("/", async (_req, res) => {
        res.render("index", {
            fetchURL,
            videos: [
                ...(await node_fetch_1.default(fetchURL + "/videos?amount=100").then((res) => res.json())),
            ],
        });
    });
    app.listen(PORT, () => {
        console.log("> Ready on http://localhost:3000");
    });
})();
