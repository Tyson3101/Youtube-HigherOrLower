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
  const [fails, setFails] = useState(0);
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

  function chose(option: "higher" | "lower") {
    let rightAnswer: boolean;
    if (option === "higher") {
      rightAnswer = compareVid.views >= mainVid.views;
    } else rightAnswer = mainVid.views >= compareVid.views;
    if (rightAnswer) correctAnswered();
    else wrongAnswered();
  }

  function correctAnswered() {
    setScore((PREVscore) => PREVscore + 1);
    if (score >= highScore) setHighScore(score);
    deleteVideo(0, 1);
  }

  function wrongAnswered() {
    setFails(fails + 1);
    setScore(0);
    deleteVideo(0, 2);
    setGameEnd(true);
  }

  function restart() {
    setGameEnd(false);
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
          <li className="fails">
            <h1>Fails: {fails}</h1>
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
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Green-Up-Arrow.svg/1077px-Green-Up-Arrow.svg.png" />
          </button>
          <button
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => chose("lower")}
          >
            <img src="https://lh3.googleusercontent.com/proxy/UTb1QoUqLWBegBN0-kIyq2F6dGom8OYny8bj8q2H0okq2BKZnbquFE-vH2xdlqINMUxgZYyE24OQvn_UNNcS3owy6N4ffio" />
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
      <div
        className="gameEnded"
        style={{ display: gameEnd ? "block" : "none" }}
      >
        <h1 className="failedMsg">You failed.</h1>
        <div className="scoreGameEnd">
          <h3>Your score was</h3>
          <h1>{score}</h1>
        </div>
        <button onClick={restart} className="restart">
          Restart
        </button>
      </div>
    </>
  );
}

export default Game;
