import fetch from "node-fetch";
import React, { useState, useEffect } from "react";
import { Video } from "youtube-helper";

function Game({ videos, fetchURL }: { videos: Video[]; fetchURL: string }) {
  const [loadingFirstVid, setLoadingFirstVid] = useState(true);
  const [loadingSecondVid, setLoadIngSecondVid] = useState(true);
  const [mainVid, setMainVid] = useState(videos[0]);
  const [compareVid, setCompareVid] = useState(videos[1]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameEnd, setGameEnd] = useState(false);
  const [videoList, _setVideoList] = useState(() => new Array() as Video[]);

  function addVideo(value: any) {
    if (Array.isArray(value)) videoList.push(...value);
    else videoList.push(value);
  }

  function deleteVideo(startIndex: number, deleteAmount: number) {
    videoList.splice(startIndex, deleteAmount);
    setMainVid(videoList[0]);
    setCompareVid(videoList[1]);
  }

  useEffect(() => {
    setHighScore(parseInt(localStorage.getItem("highScore") ?? "0"));
    async function getVideos() {
      addVideo([...Array.from(videos)]);
      setLoadingFirstVid(false);
      setLoadIngSecondVid(false);
      setMainVid(videoList[0]);
      setCompareVid(videoList[1]);
      setInterval(() => console.log(videoList.length), 5000);

      addVideo([
        ...(await fetch(fetchURL + "/video?amount=27").then((res) =>
          res.json()
        )),
      ]);
      setInterval(async () => {
        if (videoList.length > 100) return;

        addVideo([
          ...(await fetch(fetchURL + "/video?amount=15").then((res) =>
            res.json()
          )),
        ]);
      }, 1000);
    }
    getVideos();
  }, []);

  useEffect(() => {
    if (score >= highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", `${score}`);
    }
  }, [score]);

  function chose(option: "higher" | "lower") {
    let rightAnswer: boolean;
    if (option === "higher") {
      rightAnswer = compareVid.views >= mainVid.views;
    } else rightAnswer = mainVid.views >= compareVid.views;
    if (rightAnswer) correctAnswered();
    else wrongAnswered();
  }

  function correctAnswered() {
    setScore(score + 1);
    deleteVideo(0, 1);
  }

  function wrongAnswered() {
    deleteVideo(0, 2);
    setGameEnd(true);
  }

  function restart() {
    setGameEnd(false);
    setScore(0);
  }
  return (
    <>
      <div className="gameInfo">
        <ul>
          <li className="score">
            <h1>Current Score: {score}</h1>
          </li>
          <li className="highscore">
            <h1>High Score: {highScore}</h1>
          </li>
        </ul>
      </div>
      <div className="game" style={{ display: gameEnd ? "none" : "flex" }}>
        <div>
          {loadingFirstVid ? (
            <h1 className="loading">Loading...</h1>
          ) : (
            <div className="video mainVideo">
              <div style={{ background: "white" }}>
                <div className="viewCount">
                  <h1>
                    <strong>{mainVid?.viewsString} views</strong>
                  </h1>
                </div>
              </div>
              <div>
                <img
                  src={mainVid.thumbnail}
                  alt=""
                  className="thumbnail mainThumbail"
                />
              </div>
              <h1 className="title mainTitle">
                {mainVid.title} <br />
                <span className="vidInfo channel">{mainVid.channel}</span>
                <br />
                <span className="vidInfo">{mainVid.date}</span>
              </h1>
            </div>
          )}
        </div>
        <div className="choose">
          <button
            style={{ backgroundColor: "green" }}
            onClick={() => chose("higher")}
          >
            <img
              alt="More Views"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Green-Up-Arrow.svg/1077px-Green-Up-Arrow.svg.png"
            />
          </button>
          <button
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => chose("lower")}
          >
            <img src="https://i.imgur.com/Q1ocjWQ.png" alt="Less Views" />
          </button>
        </div>
        <div>
          {loadingSecondVid ? (
            <h1 className="loading">Loading...</h1>
          ) : (
            <div className="video compareVideo">
              <div style={{ background: "white" }}>
                <div className="viewCount">
                  <h1>
                    <strong>_______ views</strong>
                  </h1>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={compareVid.thumbnail}
                  alt=""
                  className="thumbnail compareThumbail"
                />
              </div>
              <h1 className="title compareTitle">
                {compareVid.title}
                <br />
                <span className="vidInfo channel">
                  {compareVid.channel}
                </span>{" "}
                <br />
                <span className="vidInfo">{compareVid.date}</span>
              </h1>
            </div>
          )}
        </div>
      </div>

      <div className="gameEnded" style={{ display: gameEnd ? "flex" : "none" }}>
        <h1 className="failedMsg">You failed.</h1>
        <h3 className="endScoreLittle">Your score was</h3>
        <h1 className="endScoreBig">{score}</h1>

        <button onClick={restart} className="restart">
          Restart
        </button>
      </div>
    </>
  );
}

export default Game;
