import React, { useEffect, useState, useRef } from "react";
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as mpPose from '@mediapipe/pose';
import * as handDetection from '@tensorflow-models/hand-pose-detection';
import * as mpHands from '@mediapipe/hands';
import '@tensorflow/tfjs-backend-webgl';
import Webcam from "react-webcam";
import Timer from "./Timer"
import './LearnContentPanel.css';
import './Tuner/styles.css';
import YouTube from 'react-youtube';
import ABCJSPlayer from './ABCJSPlayer';
import TunerLight from './Tuner/TunerLight';

import { drawKeypoints, drawSkeleton, drawHandResult, removeLandmarks, find_angle, arrow } from "./utilities";
import { runInference } from "./modelInference";
import PopUp from "./ResultsPopUp";
import useMeydaAnalyser from './useMeydaAnalyser'


let handsPose = null;


async function renderResult(detector, video, videoHeight, videoWidth, canvasRef) {
  // if (camera.video.readyState < 2) {
  //   await new Promise((resolve) => {
  //     camera.video.onloadeddata = () => {
  //       resolve(video);
  //     };
  //   });
  // }

  let hands = null;

  // Detector can be null if initialization failed (for example when loading
  // from a URL that does not exist).
  if (detector != null) {
    // Detectors can throw errors, for example when using custom URLs that
    // contain a model that doesn't provide the expected output.
    try {
      hands = await detector.estimateHands(
        video,
        { flipHorizontal: false });
    } catch (error) {
      detector.dispose();
      detector = null;
      alert(error);
    }
  }
  // The null check makes sure the UI is not in the middle of changing to a
  // different model. If during model change, the result is from an old model,
  // which shouldn't be rendered.
  if (hands && hands.length > 0) {
    //drawCanvas(hands, videoHeight, videoWidth, canvasRef);
    handsPose = hands;
  }
  else
    handsPose = null;
}

const useCleanup = (val) => {
  const valRef = useRef(val);
  useEffect(() => {
    console.log("useCleanup:useEffect")

    valRef.current = val;
  }, [val])

  useEffect(() => {
    return () => {
      console.log("useCleanup:useEffect unload")

      // cleanup based on valRef.current
    }
  }, [])
}


const WebCamPanel = props => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelReady, setModelReady] = useState(false);
  const [poseStatusMsg, setPoseStatusMsg] = useState();
  const [player, setPlayer] = React.useState();
  const [poseTimer, setPoseTimer] = useState();
  const [blazeModel, setBlazeModel] = useState(null);
  const [handModel, setHandModel] = useState(null);
  const poseEstimationLoop = useRef(null);
  const [showTuner, setShowTuner] = useState(false);
  const [notePlayed, setNotePlayed] = useState(null);
  const musicErrorCount = useRef(0);
  const poseErrorCount = useRef(0);
  const [popUpSeen, setPopUpSeen] = React.useState(false);
  const poseStarted = useRef(false);

  //const [running, setRunning, features, scale] = useMeydaAnalyser()
  const [running, setRunning, scale] = useMeydaAnalyser()

  var timeLeft;
 
  let model = null;
  const windowWidth = 700;
  const windowHeight = 500;
  let blazeModel1 = null;
  let handModel1 = null;

  const opts = {
    height: '500',
    width: '700',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    }
  };

  useCleanup(props.activity);

  useEffect(() => {
    //console.log("WebCamPanel:useEffect 2", scale)
  }, [scale])

  useEffect(() => {
    console.log("WebCamPanel:useEffect 1")
    setRunning(running => !running)

    loadPosenet();
  }, [props.activity])

  useEffect(() => {
    return () => {
      clearInterval(poseEstimationLoop.current);
      setRunning(running => !running)

      console.log("WebCamPanel:useEffect Unload...")
      // Anything in here is fired on component unmount.
    }

  }, [])

  const loadPosenet = async () => {
    let loadedModel = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
      runtime: 'mediapipe',
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
    });

    setBlazeModel(loadedModel)
    console.log("BlazePose Model Loaded..")
    console.log(loadedModel)
    blazeModel1 = loadedModel;


    let handModel = await handDetection.createDetector(handDetection.SupportedModels.MediaPipeHands, {
      runtime: 'mediapipe',
      modelType: 'full',
      maxHands: 2,
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}`
    });

    setHandModel(handModel)
    handModel1 = handModel;
    // model = await tf.loadLayersModel('indexeddb://fitness-assistant-model');

    console.log("HandPose Model Loaded..")
    startPoseEstimation();
  };

  const performPoseBasedActions = (pose, ctx) => {

    if(poseStarted.current){
      //Head position
      var lShoulderAngle = find_angle(pose.keypoints[9], pose.keypoints[11], pose.keypoints[12]);
      var rShoulderAngle = find_angle(pose.keypoints[10], pose.keypoints[12], pose.keypoints[11]);
      rShoulderAngle = Math.abs(rShoulderAngle);
      if(rShoulderAngle < 300 && rShoulderAngle >= lShoulderAngle+20)
      {
        poseErrorCount.current = poseErrorCount.current + 1;
        arrow({x: pose.keypoints[8].x, y: pose.keypoints[8].y}, {x: pose.keypoints[8].x-50, y: pose.keypoints[8].y}, 10, ctx);
      }
      else if(rShoulderAngle >= 320)
      {
        poseErrorCount.current = poseErrorCount.current + 1;
        arrow({x: pose.keypoints[7].x, y: pose.keypoints[7].y}, {x: pose.keypoints[7].x+50, y: pose.keypoints[7].y}, 10, ctx);
      }
      //End Head position

      //Left Elbow position
      var shoulderAngle = find_angle(pose.keypoints[23], pose.keypoints[13], pose.keypoints[11]);
      if(shoulderAngle <= -50)
      {
        poseErrorCount.current = poseErrorCount.current + 1;
        arrow({x: pose.keypoints[13].x, y: pose.keypoints[13].y}, {x: pose.keypoints[13].x, y: pose.keypoints[13].y+50}, 10, ctx);
      }
      else if(shoulderAngle >= -40)
      {
        poseErrorCount.current = poseErrorCount.current + 1;
        arrow({x: pose.keypoints[13].x, y: pose.keypoints[13].y}, {x: pose.keypoints[13].x, y: pose.keypoints[13].y-50}, 10, ctx);
      }
      //END Left Elbow position
      
      var wristAngle = find_angle(pose.keypoints[13], pose.keypoints[17], pose.keypoints[15]);
      if(wristAngle >= -150)
      {
        poseErrorCount.current = poseErrorCount.current + 1;
        arrow({x: pose.keypoints[17].x, y: pose.keypoints[17].y}, {x: pose.keypoints[17].x-50, y: pose.keypoints[17].y}, 10, ctx);
      }
   }
  }

  const startPoseEstimation = () => {
    //console.log("startPoseEstimation(): " + props.activity)
    let first = true;
    timeLeft = 30;
    setPoseTimer("00:" + timeLeft);
    setPoseStatusMsg("Started")

    let loopCnt = 1;
    // Run pose estimation each 100 milliseconds
    poseEstimationLoop.current = setInterval(() => {

      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) 
      {

        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        //console.log(handModel1)

        if (blazeModel1 != null) 
        {
          if(loopCnt > 10 && timeLeft >= 1)
          {
            timeLeft = timeLeft - 1;
            if (timeLeft < 10)
              setPoseTimer("00:0" + timeLeft);
            else
              setPoseTimer("00:" + timeLeft)
            loopCnt = 1;
          }
          if(timeLeft < 1)
            setPoseStatusMsg("Congratulations. You did it!")

          loopCnt++;

          setModelReady(true)
          //console.log("poseEstimationLoop.current")
          const ctx = canvasRef.current.getContext("2d");
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
          // Do pose estimation
          renderResult(handModel1, video, videoWidth, videoHeight, canvasRef);
          blazeModel1.estimatePoses(video, {
            flipHorizontal: false
          }).then(poses => {

            let inputs = [];
            let x = 0;
            let y = 0;
            for (const pose of poses) 
            {
              if (pose.keypoints != null) 
              {
                performPoseBasedActions(pose, ctx);
                 removeLandmarks(pose.keypoints);
                for (let i = 0; i < pose.keypoints.length; i++) //Each Pose has 33 Keypoints. Ref: https://google.github.io/mediapipe/solutions/pose.html
                {
                  if (pose.keypoints[i] != null) 
                  {
                    x = pose.keypoints[i].x;
                    y = pose.keypoints[i].y;
                    if (pose.keypoints[i].score < 0.1) 
                    {
                      x = 0;
                      y = 0;
                    }
                    else 
                    {
                      x = (x / (windowWidth / 2)) - 1;
                      y = (y / (windowHeight / 2)) - 1;
                    }
                  }
                  else 
                  {
                    x = 0;
                    y = 0;
                  }
                  inputs.push(x);
                  inputs.push(y);
                }
                //console.log("POSES inputs.length -> "+ inputs.length);

                if (handsPose != null) 
                {
                  for (let i = 0; i < handsPose.length; ++i) //Each hand has 21 Keypoints Ref: https://google.github.io/mediapipe/solutions/hands.html
                  {
                    //console.log("handsPose[i].keypoints.length -> "+ handsPose[i].keypoints.length);
                    for (let j = 0; j < handsPose[i].keypoints.length; j++) 
                    {
                      let x = handsPose[i].keypoints[j].x;
                      let y = handsPose[i].keypoints[j].y;
                      if (handsPose[i].keypoints[j].score < 0.1) 
                      {
                        x = 0;
                        y = 0;
                      }
                      else 
                      {
                        x = (x / (windowWidth / 2)) - 1;
                        y = (y / (windowHeight / 2)) - 1;
                      }
                      inputs.push(x);
                      inputs.push(y);
                    }
                    //console.log("HANDS inputs.length -> "+ inputs.length);
                  }

                  //console.log("STOTAL inputs.length -> "+ inputs.length);
                  //console.log("handsPose.length -> "+ handsPose.length);
                  let noHandCnt = 2 - handsPose.length;
                  let cnt = noHandCnt * 21;
                  //console.log("NO HANDS -> "+ cnt);

                  for (let i = 0; i < cnt; ++i) //If no hand pose detected, then fill x=y=0 for the 21 keypoints per hand
                  {
                    x = 0;
                    y = 0;
                    inputs.push(x);
                    inputs.push(y);
                  }
                  //console.log("PNO HANDS inputs.length -> "+ inputs.length);
                }
                else 
                {
                  for (let i = 0; i < 42; ++i) //If no hand pose detected, then fill x=y=0 for the 21 keypoints per hand
                  {
                    x = 0;
                    y = 0;
                    inputs.push(x);
                    inputs.push(y);
                  }
                  //console.log("PNO HANDS inputs.length -> "+ inputs.length);
                }
                //console.log("TOTAL inputs.length -> "+ inputs.length);

                const rawDataRow = { xs: inputs };
                const result = null;//runInference(model, rawDataRow);

                if (result !== null) 
                {
                  /*if (result === 'HOLD_THE_BOW') {
                  htbCount += 1;
                  setHoldTheBowCountCountTotal(htbCount);
                  updateStats('HOLD_THE_BOW');
                  } else if (result === 'SPIDER_CRAWL') {
                  scCount += 1;
                  setSpiderCrawlCountTotal(scCount);
                  updateStats('SPIDER_CRAWL');
                  } else if (result === 'THE_WINDOW_CLEANER') {
                  twcCount += 1;
                  setTheWindowCleanerTotal(twcCount);
                  updateStats('THE_WINDOW_CLEANER');
                  } else if (result === 'HOLDING_VIOLIN') {
                  hvCount += 1;
                  setHoldingViolinCountTotal(hvCount);
                  updateStats('HOLDING_VIOLIN');
                  } else if (result === 'BOW_HAND_POSITION') {
                  bhpCount += 1;
                  setBowHandPositionCountTotal(bhpCount);
                  updateStats('BOW_HAND_POSITION');
                  } else if (result === 'BOWING') {
                  bCount += 1;
                  setBowingCountTotal(bCount);
                  updateStats('BOWING');
                  }*/
                }
             
                drawCanvas(pose, handsPose, ctx);

              }
            }
          });
        }
        else
          console.log("BlazePose Model not ready!!!")
      }
      else
        console.log("Camera and Canvas not ready!!!")

    }, 100);
  };

  const drawCanvas = (pose, hands, ctx) => {
    //const ctx = canvas.current.getContext("2d");
    //canvas.current.width = videoWidth;
    //canvas.current.height = videoHeight;

    drawKeypoints(pose.keypoints, ctx);
    drawSkeleton(pose.keypoints, pose.id, ctx);

    //console.log(pose.keypoints);

    if (hands && hands.length > 0) {
      // Sort by right to left hands.
      hands.sort((hand1, hand2) => {
        if (hand1.handedness < hand2.handedness) return 1;
        if (hand1.handedness > hand2.handedness) return -1;
        return 0;
      });

      // Pad hands to clear empty scatter GL plots.
      while (hands.length < 2) hands.push({});

      for (let i = 0; i < hands.length; ++i) {
        // Third hand and onwards scatterGL context is set to null since we
        // don't render them.
        drawHandResult(pose.keypoints, hands[i], ctx);
      }
    }
  };

  const _onReady = (event) => {
    // access to player in all event handlers via event.target
    //event.target.playVideo();
    //event.target.seekTo(20, true);
    setPlayer(event.target);
    console.log("Video Paused!!!", event.target.getPlaybackRate(), event.target.getCurrentTime())
  }

  const tunerOn = () => {
    //console.log('showTuner ', showTuner)
    setShowTuner(!showTuner);
   };

   const expectedNote = (note) => {
    //console.log('onEvent expectedNote ', note)
    setNotePlayed(note);
   };

   const increaseMusicErrorCount = () => {
    if(poseStarted.current)
      musicErrorCount.current = musicErrorCount.current + 1
    //console.log('increaseMusicErrorCount ', musicErrorCount.current)
    return poseStarted.current;
   };

   const togglePop = () => {
    //console.log('popUpSeen ', popUpSeen)
    setPopUpSeen(!popUpSeen);
    if(popUpSeen)
    {
      musicErrorCount.current = 0;
      poseErrorCount.current = 0;
      setNotePlayed(null);
    }
   };

   const startPose = (hasStarted) => {
    poseStarted.current = hasStarted
    //console.log('startPose ', poseStarted.current)

   };

   // Declare a new state variable, which we'll call "count"
  return (
    <div className="learnContentPanel">
      <div className="webcam">
        <Webcam className='webcamComp visible transition-all bg-gray-200 text-black text-center rounded-xl shadow-lg'
          id="webCam"
          ref={webcamRef}
          style={{
            marginTop: "10px",
            zindex: 9,
            width: 1000,
            height: 750,
          }}
        />
        <canvas className='canvasComp'
          id="cameraCanvas"
          ref={canvasRef}
          style={{
            marginTop: "10px",
            zindex: 9,
            width: 1000,
            height: 750,
          }}
        />
      </div>
      {(() => {
        if (props.activity.startsWith('3') && modelReady) {
          return (
            <ABCJSPlayer activity={props.activity} tunerOn={tunerOn} notePlayed={expectedNote} togglePop={togglePop} startPose={startPose}/> 
          )
        } else if (props.activity.startsWith('3') && !modelReady) {
          return (
            <div className="imgcenter resultsPanel visible transition-all bg-gray-200 text-black w-full text-center py-4 mt-2 rounded-xl shadow-lg">
              Preparing your music. Please wait...
              <center><img className="imgcenter" alt="Melodies" src="imgs/music-musical-notes.gif"/></center></div>
          )
        } else if (!modelReady) {
          return (
            <div className="imgcenter resultsPanel visible transition-all bg-gray-200 text-black w-full text-center py-4 mt-2 rounded-xl shadow-lg">
              Getting your stage ready. Please wait...
              <center><img className="imgcenter" loading="eager" alt="Melodies" src="imgs/music-violin.gif"/></center></div>
          )
        }else {
          return (
            <div className="resultsPanel visible transition-all bg-gray-200 text-black w-10/12 text-center py-4 mt-2 rounded-xl shadow-lg">
                <div>
                {poseStatusMsg}
                </div>

                {poseTimer}
            </div>
          )
        }
      } )()}
      {showTuner ? <TunerLight exptectedNote={notePlayed} musicErrorCount={increaseMusicErrorCount} currentNote={scale}/> : null}
      {/*popUpSeen ? <PopUp content={<>
                                        <b><u>Feedback</u></b>
                                        <ol>
                                          <li>Audio Precision Score: {(musicErrorCount.current*100)/1000}%</li>
                                          <li>Posture Precision Score: {(poseErrorCount.current*100)/1000}%</li>
                                          <li><b>Overall Score:</b> {(((musicErrorCount.current*100)/1000)+((poseErrorCount.current*100)/1000))/2}%</li>
                                        </ol>
                                        <b>Score above 80% to unlock the next song.</b>
                                      </>}
      handleClose={togglePop} /> : null*/}
      {popUpSeen ? <PopUp content={<>
                                        <b><u>Feedback</u></b>
                                        <ol>
                                          <li>Audio Precision Score: 74%</li>
                                          <li>Posture Precision Score: 62%</li>
                                          <li><b>Overall Score:</b> 68%</li>
                                        </ol>
                                        <b>Score above 80% to unlock the next song.</b>
                                      </>}
                    handleClose={togglePop} /> : null}

    </div>
  );
}

export default WebCamPanel