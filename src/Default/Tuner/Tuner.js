import { useEffect, useState, useRef } from "react";
import AudioContext from "./contexts/AudioContext";
import autoCorrelate from "./libs/AutoCorrelate";
import {
  noteFromPitch,
  centsOffFromPitch,
  getDetunePercent,
} from "./libs/Helpers";
import "./styles.css";
import './../LearnContentPanel.css';

const audioCtx = AudioContext.getAudioContext();
const analyserNode = AudioContext.getAnalyser();
const buflen = 2048;
var buf = new Float32Array(buflen);

const noteStrings = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function Tuner() {
  const [stringToTune, setStringToTune] = useState(null);
  const [tuneDirection, setTuneDirection] = useState(null);

  const [source, setSource] = useState(null);
  const [started, setStart] = useState(false);
  const [pitchNote, setPitchNote] = useState("C");
  const [pitchScale, setPitchScale] = useState("4");
  const [pitch, setPitch] = useState("0 Hz");
  const [detune, setDetune] = useState("0");
  const [notification, setNotification] = useState(false);
  const tunerLoop = useRef(null);

  const updatePitch = (time) => {
    analyserNode.getFloatTimeDomainData(buf);
    var ac = autoCorrelate(buf, audioCtx.sampleRate);
    if (ac > -1) {
      let note = noteFromPitch(ac);
      let sym = noteStrings[note % 12];
      let scl = Math.floor(note / 12) - 1;
      let dtune = centsOffFromPitch(ac, note);
      setPitch(parseFloat(ac).toFixed(2) + " Hz");
      setPitchNote(sym);
      setPitchScale(scl);
      setDetune(dtune);
      setNotification(false);
      if (stringToTune == 'e')
      {
        if(note == 76)
          setTuneDirection('In Tune')
        else if (note > 76)
          setTuneDirection('Loosen String')
        else
          setTuneDirection('Tighten String')
      }
      else if (stringToTune == 'a')
      {
        if(note == 69)
          setTuneDirection('In Tune')
        else if (note > 69)
          setTuneDirection('Loosen String')
        else
          setTuneDirection('Tighten String')
      }
      else if (stringToTune == 'd')
      {
        if(note == 62)
          setTuneDirection('In Tune')
        else if (note > 62)
          setTuneDirection('Loosen String')
        else
          setTuneDirection('Tighten String')
      }
      else if (stringToTune == 'g')
      {
        if(note == 55)
          setTuneDirection('In Tune')
        else if (note > 55)
          setTuneDirection('Loosen String')
        else
          setTuneDirection('Tighten String')
      }

      console.log(note, sym, scl, dtune, ac);
    }
  };

  useEffect(() => {
    if (source != null) {
      source.connect(analyserNode);
    }
    else
      start();

    return () => {
      console.log("Tuner:useEffect with params Unload...")
      if (source != null) {
        console.log("audioCtx.state", audioCtx.state)
        
        try{source.disconnect(analyserNode);setStart(false);}catch(DOMException){}
        console.log("Tuner:useEffect with params Disconnected...")
      }
        // Anything in here is fired on component unmount.
    }   
  }, [source]);


  if(started)
    setInterval(updatePitch, 1);

  const start = async () => {
    console.log("start()...")

    const input = await getMicInput();

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
    setStart(true);
    setNotification(true);
    setTimeout(() => setNotification(false), 5000);
    setSource(audioCtx.createMediaStreamSource(input));
  };

  const stop = () => {
    source.disconnect(analyserNode);
    setStart(false);
  };

  const getMicInput = () => {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0,
      },
    });
  };

  const tuneA = () => {
    setStringToTune('a');
  }
  const tuneE = () => {
    setStringToTune('e');
  }
  const tuneD = () => {
    setStringToTune('d');
  }
  const tuneG = () => {
    setStringToTune('g');
  }

  return (
    <div className="tuner">
    <div className="tunerComp flex justify-center items-center">
      <div
        className={
          notification
            ? "visible transition-all fixed top-0 bg-gray-400 text-white w-10/12 text-xs md:text-sm text-center py-4 mt-2 rounded-full shadow-2xl"
            : "invisible fixed top-0"
        }
      >
        Please, bring your instrument near to the microphone!
      </div>
      <div className="flex flex-col items-center">
        {started?
        <div className="mb-5">
          <button
            className={stringToTune == 'e' ? "bg-green-600 text-white w-10 h-10 rounded-full shadow-xl transition-all mx-5": "bg-blue-600 text-white w-10 h-10 rounded-full shadow-xl transition-all mx-5"}  onClick={tuneE}>
            E
          </button>
          <button
            className={stringToTune == 'a' ? "bg-green-600 text-white w-10 h-10 rounded-full shadow-xl transition-all mx-5": "bg-blue-600 text-white w-10 h-10 rounded-full shadow-xl transition-all mx-5"}  onClick={tuneA}>
            A
          </button>
          <button
            className={stringToTune == 'd' ? "bg-green-600 text-white w-10 h-10 rounded-full shadow-xl transition-all mx-5": "bg-blue-600 text-white w-10 h-10 rounded-full shadow-xl transition-all mx-5"}  onClick={tuneD}>
            D
          </button>
          <button
            className={stringToTune == 'g' ? "bg-green-600 text-white w-10 h-10 rounded-full shadow-xl transition-all mx-5": "bg-blue-600 text-white w-10 h-10 rounded-full shadow-xl transition-all mx-5"}  onClick={tuneG}>
            G
          </button>

          </div>
          :<span/>
        }
        <div
          className={
            started
              ? "visible flex flex-col transition-all ease-in delay-75 bg-gray-200 justify-center items-center p-10 rounded-xl shadow-lg mb-5 w-100 h-96"
              : "invisible transition-all w-0 h-0"
          }
        >

          <div className="w-full flex justify-center items-center">
            <div
              className="bg-gradient-to-r to-green-400 from-red-600 py-10  rotate-180"
              style={{
                width: (detune < 0 ? getDetunePercent(detune) : "50") + "%",
              }}
            ></div>
            <span className="font-bold text-lg text-green-800">I</span>
            <div
              className="bg-gradient-to-r from-green-400 to-red-600 py-10"
              style={{
                width: (detune > 0 ? getDetunePercent(detune) : "50") + "%",
              }}
            ></div>
          </div>
          
          <div className="mt-2 text-xs text-gray-400">
            <span>{pitch}</span>
          </div>

          <div className="flex items-start font-mono">
            <span
              className={
                started
                  ? "visible transition-all delay-75 font-thin text-4xl"
                  : "invisible text-xs"
              }
            >
              {pitchNote}
            </span>
          </div>
          
          <div className="flex items-start font-mono">
            <span
              className={
                started
                  ? "visible transition-all delay-75 font-thin text-5xl"
                  : "invisible text-xs"
              }
            >
              {tuneDirection}
            </span>
          </div>

        </div>
        {!started ? (
          <button
            className="bg-green-600 text-white w-20 h-10 rounded-full shadow-xl transition-all"
            onClick={start}
          >
            Start
          </button>
        ) : (
          <button
            className="bg-red-800 text-white w-20 h-10 rounded-full shadow-xl transition-all"
            onClick={stop}
          >
            Stop
          </button>
        )}
      </div>
    </div>
    <div className="tunerCompEmpty"></div>
    </div>
  );
}

export default Tuner;
