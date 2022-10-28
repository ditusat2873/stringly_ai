import { useEffect, useState, useRef } from "react";
import AudioContext from "./contexts/AudioContext";
import autoCorrelate from "./libs/AutoCorrelate";
import {
  noteFromPitch,
  centsOffFromPitch,
  getDetunePercent,
  centsOffFromPitchUsingNotSymbol
} from "./libs/Helpers";
import "./styles.css";
import './../LearnContentPanel.css';
import { arrow } from "./../utilities";

//const audioCtx = AudioContext.getAudioContext();
//const analyserNode = AudioContext.getAnalyser();
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

const TunerLight = props => {

  const [source, setSource] = useState(null);
  const [started, setStart] = useState(false);
  const [pitchNote, setPitchNote] = useState("C");
  //const [pitchScale, setPitchScale] = useState("4");
  //const [pitch, setPitch] = useState("0 Hz");
  const [detune, setDetune] = useState("0");
  const [notification, setNotification] = useState(false);
  //const tunerLoop = useRef(null);
  const canvasRef = useRef(null);

  const updatePitch = (time) => {
    //analyserNode.getFloatTimeDomainData(buf);
    var ac = -1;//autoCorrelate(buf, audioCtx.sampleRate);
    if (ac > -1) {
      let note = noteFromPitch(ac);
      console.log('centsOffFromPitch sEC', ac,   note )

      let sym = noteStrings[note % 12];
      let scl = Math.floor(note / 12) - 1;
      //let dtune = centsOffFromPitch(ac, note);
      let dtune = centsOffFromPitchUsingNotSymbol(props.currentNote, props.exptectedNote)
      //setPitch(parseFloat(ac).toFixed(2) + " Hz");
      setPitchNote(sym);
      //setPitchScale(scl);
      setDetune(dtune);
      setNotification(false);

      if(props.exptectedNote)
      {
        //console.log('TunerLight updatePitch', props.exptectedNote, sym);

        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = 50;
        canvasRef.current.height = 50;
       if(noteStrings.indexOf(props.exptectedNote) >= noteStrings.indexOf(sym)-2 && (noteStrings.indexOf(props.exptectedNote) <= noteStrings.indexOf(sym)+2))
       //if(noteStrings.indexOf(props.exptectedNote) === noteStrings.indexOf(sym))
       {
         arrow({x: 0, y: 25}, {x: 49, y: 25}, 10, ctx);
         arrow({x: 49, y: 25}, {x: 0, y: 25}, 10, ctx);
       }
       else if(noteStrings.indexOf(props.exptectedNote) < noteStrings.indexOf(sym))
       {
        //console.log('TunerLight increase', props.musicErrorCount());
          if(props.musicErrorCount())
            arrow({x: 25, y: 49}, {x: 25, y: 0}, 10, ctx);
       }
       else if(noteStrings.indexOf(props.exptectedNote) > noteStrings.indexOf(sym))
       {
        //console.log('TunerLight increase', props.musicErrorCount());

        if(props.musicErrorCount())
          arrow({x: 25, y: 0}, {x: 25, y: 49}, 10, ctx);
       }
      }
    }
  };



  useEffect(() => {
    console.log("TunerLight useEffect", props.currentNote)
    let dtune = centsOffFromPitchUsingNotSymbol(props.currentNote, props.exptectedNote)
    setDetune(dtune);

    if(props.exptectedNote)
    {
      //console.log('TunerLight updatePitch', props.exptectedNote, sym);

      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = 50;
      canvasRef.current.height = 50;
     if(noteStrings.indexOf(props.exptectedNote) >= noteStrings.indexOf(props.currentNote)-2 && (noteStrings.indexOf(props.exptectedNote) <= noteStrings.indexOf(props.currentNote)+2))
     //if(noteStrings.indexOf(props.exptectedNote) === noteStrings.indexOf(sym))
     {
       arrow({x: 0, y: 25}, {x: 49, y: 25}, 10, ctx);
       arrow({x: 49, y: 25}, {x: 0, y: 25}, 10, ctx);
     }
     else if(noteStrings.indexOf(props.exptectedNote) < noteStrings.indexOf(props.currentNote))
     {
      //console.log('TunerLight increase', props.musicErrorCount());
        if(props.musicErrorCount())
          arrow({x: 25, y: 49}, {x: 25, y: 0}, 10, ctx);
     }
     else if(noteStrings.indexOf(props.exptectedNote) > noteStrings.indexOf(props.currentNote))
     {
      //console.log('TunerLight increase', props.musicErrorCount());

      if(props.musicErrorCount())
        arrow({x: 25, y: 0}, {x: 25, y: 49}, 10, ctx);
     }
    }

    /*if (source != null) {
      source.connect(analyserNode);
    }
    else
      start();*/

    return () => {
      //console.log("TunerLight useEffect with params Unload...")
      if (source != null) {
        //console.log("audioCtx.state", audioCtx.state)
        
        //try{source.disconnect(analyserNode);setStart(false);}catch(DOMException){}
        //console.log("TunerLight:useEffect with params Disconnected...")
      }
        // Anything in here is fired on component unmount.
    }   
  }, [source, props.exptectedNote, props.currentNote]);//, props.exptectedNote , props.currentNote


  //setInterval(updatePitch, 1);

  const start = async () => {
    console.log("TunerLight:start()...")

    const input = await getMicInput();

    //if (audioCtx.state === "suspended") {
    //  await audioCtx.resume();
    //}
    setStart(true);
    setNotification(true);
    setTimeout(() => setNotification(false), 5000);
    //setSource(audioCtx.createMediaStreamSource(input));
  };

  const stop = () => {
    //source.disconnect(analyserNode);
    setStart(false);
  };

  const getMicInput = () => {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0
      },
    });
  };

  return (
    <div className="tunerlight">
      <div className="tunerComp flex">
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
          <div
            className={
              "visible flex flex-col transition-all ease-in delay-75 bg-gray-200 justify-center items-center rounded-xl shadow-lg py-3 mb-5 w-200"
            }
          >

          <div className="w-full flex justify-center items-center">
            <div
                className="bg-gradient-to-r to-green-400 from-red-600 py-8 rotate-180"
                style={{
                  width: (detune < 0 ? getDetunePercent(detune) : "50") + "%",
                }}
              ></div>
              <span className="font-bold text-lg text-green-800">I</span>
              <div
                className="bg-gradient-to-r from-green-400 to-red-600 py-8"
                style={{
                  width: (detune > 0 ? getDetunePercent(detune) : "50") + "%",
                }}
              ></div>
            </div>
            
            <div className="flex items-start font-mono">
              <span
                className={
                    "visible transition-all delay-75 font-thin text-4xl"
                }
              >
                {props.currentNote}
              </span>
            </div>
            
          </div>
        </div>
        <div>
          <span>
            &nbsp;&nbsp;&nbsp;
          </span>
        </div>
         <div className="visible flex flex-col transition-all ease-in delay-75 bg-gray-200 justify-center items-center rounded-xl shadow-lg py-3 mb-5 w-48">
         <span
                className={
                    "visible transition-all delay-75 font-thin text-4xl"
                }
              >
                {props.exptectedNote}
              </span>
         <canvas className='canvasComp'
          id="tunerCanvas"
          ref={canvasRef}
          style={{
            marginTop: "10px",
            zindex: 9,
            width: 50,
            height: 50
          }}
         />
        </div>
      </div>
    </div>
  );
}

export default TunerLight;
