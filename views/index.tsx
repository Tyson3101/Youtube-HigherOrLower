import React from "react";
import { Video } from "youtube-helper";
import Game from "./Game";
import "./css/style.css";

function App({ videos, fetchURL }: { videos: Video[]; fetchURL: string }) {
  return (
    <>
      <div className="header">
        <img
          className="headerImg"
          src="https://www.youtube.com/img/desktop/supported_browsers/yt_logo_rgb_light.png"
        />
        <h1 className="headerTitle">Higher or Lower!</h1>
      </div>
      <Game videos={videos} fetchURL={fetchURL}></Game>
    </>
  );
}

export default App;
