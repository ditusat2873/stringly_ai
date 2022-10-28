import ABCJS from "abcjs";
import React, { useEffect} from "react";
import './abcjs-audio.css';
import './LearnContentPanel.css';
import './Tuner/styles.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

const ABCJSPlayer = props => {
  const synthControl = React.useRef();
  const timingCallbacks = React.useRef();
  const [checked, setChecked] = React.useState(true);
  const [playing, setPlaying] = React.useState(false);
  const [bpmValue, setBpmValue] = React.useState(100);
  var musicIndex = 0;

    class CursorControl {
    constructor() {
      var self = this;
      self.onReady = function () {
        console.log("onReady()");
      };

      self.onStart = function () 
      {
        console.log("onStart() playing", playing);
        props.startPose(true);
        setPlaying(true);

        var svg = document.querySelector("#paper svg");
        var cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cursor.setAttribute("class", "abcjs-cursor");
        cursor.setAttributeNS(null, 'x1', 0);
        cursor.setAttributeNS(null, 'y1', 0);
        cursor.setAttributeNS(null, 'x2', 0);
        cursor.setAttributeNS(null, 'y2', 0);
        if(cursor && svg)
          svg.appendChild(cursor);
      };
      
      self.beatSubdivisions = 2;
      
      self.onBeat = function (beatNumber, totalBeats, totalTime) 
      {
      };
      
      self.onEvent = function (ev) 
      {
        //console.log("CursorControl.onEvent", checked);

        if (ev.measureStart && ev.left === null)
          return; // this was the second part of a tie across a measure line. Just ignore it.

        var lastSelection = document.querySelectorAll("#paper svg .abcjs-highlight");
        for (var k = 0; k < lastSelection.length; k++)
          lastSelection[k].classList.remove("abcjs-highlight");

        for (var i = 0; i < ev.elements.length; i++) {
          var note = ev.elements[i];
          for (var j = 0; j < note.length; j++) {
            note[j].classList.add("abcjs-highlight");
          }
        }


        var cursor = document.querySelector("#paper svg .abcjs-cursor");
        if (cursor) 
        {
          cursor.setAttribute("x1", ev.left - 2);
          cursor.setAttribute("x2", ev.left - 2);
          cursor.setAttribute("y1", ev.top);
          cursor.setAttribute("y2", ev.top + ev.height);
        }
      };
      
      self.onFinished = function () 
      {
        console.log("onFinished() playing", playing);
        props.startPose(false);
        setPlaying(false);
        props.togglePop();

        //playing.current = false;

        var els = document.querySelectorAll("svg .highlight");
        for (var i = 0; i < els.length; i++) 
        {
          els[i].classList.remove("highlight");
        }
        var cursor = document.querySelector("#paper svg .abcjs-cursor");
        if (cursor) 
        {
          cursor.setAttribute("x1", 0);
          cursor.setAttribute("x2", 0);
          cursor.setAttribute("y1", 0);
          cursor.setAttribute("y2", 0);
        }
      };
    }
  }
        var cursorControl = new CursorControl();
        var music;

        const setSong = () =>{
          music = [
            //"T: Twinkle, twinkle, little star\n" +
            //"M: C\n" +
            //"Q: "+bpmValue+"\n" +
            //"L: 1/4\n" +
            //"K: C\n" +
            //"%%MIDI program 41\n" +
            //"CCGG|\n",
            //"CCGG|AAG2|FFEE|DDC2:|\n",
            //"|:GGFF|EED2|GGFF|EED2|\n" +
            //"CCGG|AAG2|FFEE|DDC2:|",


            "X:1\n" +
            "T: Twinkle Twinkle Little Star\n" +
            "L:1/4\n" +
            "M:C\n" +
            "Q: "+bpmValue+"\n" +
            "K:A\n" +
            "%%MIDI program 41\n" +
            "vA A e e|f f e2|d d c c|B B A2|\n" +
            "ve e d d|c c B2|ue e d d|c c B2|\n" +
            "vA A e e|f f e2|ud d c c|B B A2|]" ,
        

            "X:1\n" +
            "T: Lightly Row\n" +
            "M:C\n" +
            "Q: "+bpmValue+"\n" +
            "K:A\n" +
            "L:1/4\n" +
            "e c c2|d B B2|A B c d|e e e2|\n" +
            "e c c c|d B B B|A c e e|c c c2|\n" +
            "B B B B|B c d2|c c c c|c d e2|\n" +
            "e c c c|d B B B|A c e e|c c c2|]",


            "X:1\n" +
            "T: Song of the Wind\n" +
            "L:1/16\n" +
            "M:2/4\n" +
            "Q: "+bpmValue+"\n" +
            "K:A\n" +
            "Q: "+bpmValue+"\n" +
            "!mf!vA2B2 c2d2|e2e2 e2e2|f2d2 a2f2|e4 z4|\n" +
            "f2d2 a2f2|e4 z4|ve2d2 d2d2|d2c2 c2c2|c2B2 B2B2|\n" +
            "A2c2 e4|ve2d2 d2d2|d2c2 c2c2|c2B2 B2B2|A4 z4:|]",
          ];
        }
      
        var currentTune = 0;
        var abcOptions = {
          add_classes: true,
          //clickListener: clickListenerM,
          afterParsing: afterParsing,
          responsive: "resize",
          qpm: 5
        };
      
        useEffect(() => {
          console.log("ABCJSPlayer:useEffect")
          props.startPose(false);
          setPlaying(false);
          if(props.activity === '300')
            musicIndex = 0;
          else if(props.activity === '301')
            musicIndex = 1;
          else if(props.activity === '302')
            musicIndex = 2;
          
          //playing.current = false;
          loadABCJS();
        }, [props.activity, bpmValue, checked])
      
        useEffect(() => {
          return () => {
            if(playing)
              synthControl.current.play();

            console.log("ABCJSPlayer:useEffect Unload... playing", playing)
            // Anything in here is fired on component unmount.
          }
        }, [props.activity, bpmValue, checked])

        const loadABCJS = () => {
          if (ABCJS.synth.supportsAudio()) 
          {
            synthControl.current = new ABCJS.synth.SynthController();
            synthControl.current.load("#audio", cursorControl, {displayLoop: false, displayRestart: false, displayPlay: false, displayProgress: true, displayWarp: false, displayClock: true});
           
            console.log("loadABCJS()")
          }
          setTune(false);
        }
      
        function onEvent(ev) 
        {
          console.log("onEvent ", checked);
          if(music[musicIndex] && ev)
          {
            let note = music[musicIndex].substring(ev.startChar, ev.endChar).toUpperCase();
            if(note.startsWith('U') || note.startsWith('V'))
              note = note.substring(1);
            props.notePlayed(note);
          }
          if(!checked)
          {
            if (ev)
            {
              cursorControl.onEvent(ev);
            }
            else
              cursorControl.onFinished();
          }
        }
          
        var midiBuffer;
        function setTune(userAction) 
        {
          if(midiBuffer)
          {
            midiBuffer.stop()
            console.log("miniBuffer Stopped");
          }
          else
            console.log("miniBuffer NO CHANGE");

          setSong();
          var visualObj = ABCJS.renderAbc("paper", music[musicIndex], abcOptions)[0];
          //cursorControl.onStart();

          timingCallbacks.current = new ABCJS.TimingCallbacks(visualObj, {
              eventCallback: onEvent
          });
          console.log("timingCallbacks", timingCallbacks.current);
          if(checked)
          { 
            // TODO-PER: This will allow the callback function to have access to timing info - this should be incorporated into the render at some point.
            midiBuffer = new ABCJS.synth.CreateSynth();
            midiBuffer.init({
              //audioContext: new AudioContext(),
              visualObj: visualObj,
              // sequence: [],
              // millisecondsPerMeasure: 1000,
              // debugCallback: function(message) { console.log(message) },
              options: {
                // soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/" ,
                // sequenceCallback: function(noteMapTracks, callbackContext) { return noteMapTracks; },
                // callbackContext: this,
                // onEnded: function(callbackContext),
                // pan: [ -0.5, 0.5 ]
              }
            }).then(function (response) {
              console.log(response);
              if (synthControl.current) 
              {
                synthControl.current.setTune(visualObj, userAction).then(function (response) 
                {
                  console.log("Audio successfully loaded.")
                }).catch(function (error) 
                {
                  console.warn("Audio problem:", error);
                });
              }
            }).catch(function (error) {
              console.warn("Audio problem:", error);
            });
          }
        }
      
        const playNotes = (event) => {
          if (synthControl.current)
          {
            console.log("start playNotes playing", playing);
            if(!playing)
            {
              props.startPose(true);
              cursorControl.onStart();
              timingCallbacks.current.start();
              setPlaying(true);

              //playing.current = true;
            }
            else
            {
              //playing.current = false;
              props.startPose(false);
              setPlaying(false);
              timingCallbacks.current.pause();
            }

              //console.log("--------------------playNotes ", playing, checked);

            if(checked)
              synthControl.current.play();
          }
          else
            console.log("synthControl null ");

          console.log("playNotes playing ", playing);

        }

        /*function pageScroll() {
          window.scrollBy(0, 10); // horizontal and vertical scroll increments
          scrolldelay = setTimeout('pageScroll()', 100); // scrolls every 100 milliseconds
          if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            clearTimeout(scrolldelay);
            scrolldelay = setTimeout('PageUp()', 2000);
          }
        }*/
        const handleChange = (event) => {
          setChecked(event.target.checked);
          props.tunerOn();
          console.log("playNotes ", checked);
          if(checked)
            synthControl.current.disable(true);
          else
            synthControl.current.disable(false);
        };

        const bpmTxtFldChange = (event) => {
          console.log("bpmTxtFldChange ", event.target.value);
          setBpmValue(event.target.value);
        };

        function afterParsing(tune, tuneNumber, abcString)
        {
          console.log("afterParsing ", tune);
          console.log("afterParsing ", tuneNumber);

        }


        return (
          <div className="resultsPanel visible transition-all bg-gray-200 text-black w-full text-center py-4 mt-2 rounded-xl shadow-lg">
             <div className="abcjsStart">
             <button className="start" onClick={playNotes}>{playing?"Pause":"Start"}</button>
              <FormControlLabel className="accompaniment" control={<Checkbox  checked={checked}
                                                  onChange={handleChange} 
                                                  defaultChecked />} label="Accompaniment" />
            <TextField className="bpm"
              id="bpmTxtFld"
              label="Tempo"
              value={bpmValue}
              type="number"
              onChange={bpmTxtFldChange} 
              InputLabelProps={{
                  shrink: true,
                }}
            /></div>
            <div id="paper"></div>
            <div id="audio"></div>
          </div>
        );
      }
      
export default ABCJSPlayer;
      