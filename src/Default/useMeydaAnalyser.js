import { useEffect, useState, useRef } from 'react'
import Meyda from 'meyda'

const getMedia = async () => {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      })
    } catch (err) {
      console.log('Unable to initialize Media Devices Error:', err)
    }
  }
  
  const useMeydaAnalyser = () => {
    const [analyser, setAnalyser] = useState(null)
    const [running, setRunning] = useState(false)
    const [features, setFeatures] = useState(null)
    const [scale, setScale] = useState(null)
    var start = useRef(Date.now())
    const detectedNotes = useRef(new Array())
    const allNotes = useRef(new Array())
    const notesCount = useRef(new Array())
    const currentNoteCount = useRef(0)
  
    //var start = Date.now();
  
    useEffect(() => {
      const audioContext = new AudioContext()
      const scales = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
      //const scales = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      start.current = Date.now();
      let newAnalyser
      getMedia().then(stream => {
        if (audioContext.state === 'closed') {
          return
        }
        const source = audioContext.createMediaStreamSource(stream) 

        var FRAME_SIZE = 512;
        var HOP_SIZE = FRAME_SIZE;
        var MFCC_COEFFICIENTS = 13;
        Meyda.bufferSize = FRAME_SIZE;
        Meyda.hopSize = HOP_SIZE;
        Meyda.windowingFunction = "hanning";
        Meyda.numberOfMFCCCoefficients = MFCC_COEFFICIENTS;
      
        newAnalyser = Meyda.createMeydaAnalyzer({
          audioContext: audioContext,
          source: source,
          bufferSize: 512,
          featureExtractors: ['chroma', 'rms'],//, 'spectralCentroid', 'spectralFlatness', 'spectralSlope'],
          callback: features => {
            //console.log('sampleRate', audioContext.sampleRate)

            //var delta = Date.now() - start.current; // mitlliseconds elapsed since start
            //console.log(features)
            //console.log(features.rms) 
            //console.log(features.chroma)
            //console.log(features.amplitudeSpectrum)
            //console.log(features.powerSpectrum) 
            const max = Math.max(...features.chroma);
            const index = features.chroma.indexOf(max);
            //console.log('max', max, scales[index])

            /*let res = Math.floor(delta / 1000);
            let milliseconds = delta.toString().substr(-3);
            let seconds = res % 60;
            let minutes = (res - seconds) / 60;*/

            //console.log(minutes +":"+seconds +":"+ milliseconds, scales[index]);

            //console.log(scale, features.rms, features.spectralCentroid, features.spectralFlatness)
            if(features.rms > 0.009){
              //console.log('useMeydaAnalyser', scale, features.rms, features.spectralCentroid, features.spectralFlatness)
              const scale = scales[index];
              setScale(scale)
              //console.log('useMeydaAnalyser', scale, features.rms)

              /*let prevIndex = 0;
              let nextIndex = 0;
              if(index === 0)
              {
                prevIndex = 11;
                nextIndex = 2;  
              }
              else if(index === 11)
              {
                prevIndex = 10;
                nextIndex = 0;
              }
              else
              {
                prevIndex = index - 1;
                nextIndex = index + 1;
              }

              //A,B,C,D,D,D,D,D,E,F,G,A,D,A
              if(allNotes.current[allNotes.current.length - 1] !== scale)
              {
                    let alreadySet = false;
                    if(currentNoteCount.current >=5)
                    {
                      if( allNotes.current[allNotes.current.length - 1] === scales[prevIndex] 
                        || allNotes.current[allNotes.current.length - 1] === scales[nextIndex])
                      {
                        notesCount.current[notesCount.current.length - 1] = notesCount.current[notesCount.current.length - 1] + 1;
                        currentNoteCount.current = currentNoteCount.current + 1;
                        alreadySet = true;
                        if(!detectedNotes.current[detectedNotes.current.length - 1])
                        {
                          console.log('Adding New Note for ', allNotes.current[allNotes.current.length -1], currentNoteCount.current)
                          notesCount.current.push(currentNoteCount.current)
                          detectedNotes.current.push(allNotes.current[allNotes.current.length -1])
                        }
                        console.log('Similar note for ', allNotes.current[allNotes.current.length - 1], scales[index], currentNoteCount.current)
                      }
                      else 
                      {
                        //console.log('Scale: ', contents.current[contents.current.length -1], scaleCnt.current)
                        if(detectedNotes.current[detectedNotes.current.length - 1] === allNotes.current[allNotes.current.length - 1]) // to handle situations where D,D,C occurs need to club the two D's
                        {
                          console.log('Increasing Count for ', allNotes.current[allNotes.current.length -1], currentNoteCount.current)
                          notesCount.current[notesCount.current.length - 1] = notesCount.current[notesCount.current.length - 1] + currentNoteCount.current;
                        }
                        else
                        {
                          console.log('Adding Note for ', allNotes.current[allNotes.current.length -1], currentNoteCount.current)
                          notesCount.current.push(currentNoteCount.current)
                          detectedNotes.current.push(allNotes.current[allNotes.current.length -1])
                        }
                      }
                    }
                    if(!alreadySet)
                    {
                      allNotes.current.push(scale)
                      currentNoteCount.current = 1;
                    }
                }
                else
                {
                  currentNoteCount.current = currentNoteCount.current + 1;
                }*/
            }
            setFeatures(features)
          },
        })
        setAnalyser(newAnalyser)
      })
      return () => {
        if (newAnalyser) {
          newAnalyser.stop()
        }
        if (audioContext) { 
          audioContext.close()
          console.log('CLOSE()')
        }
      }
    }, [])
  
    useEffect(() => {
      if (analyser) {
        if (running) {
          console.log('START()')
            start.current = Date.now();
            analyser.start()
        } else {
            start.current = Date.now();
            analyser.stop()
            console.log('STOP()')
            makeCSV(detectedNotes)
            makeCSV(notesCount)
            let newNotes = [];
            notesCount.current.forEach((item, i) => {
              if(item > 10)
              {
                if(!newNotes[newNotes.length - 1]  || (newNotes[newNotes.length - 1] && newNotes[newNotes.length - 1] !== detectedNotes.current[i]))
                  newNotes.push(detectedNotes.current[i])
              }
            })
            makeCSV(newNotes)

            detectedNotes.current.length = 0;
            allNotes.current.length = 0;
            notesCount.current.length = 0;
            currentNoteCount.current = 0;
        }
      }
    }, [running, analyser])
  
    const makeCSV = (content) => {
      let csv = '';
      let data;
        if(content.current)
          data = content.current;
        else
          data = content; 
        data.forEach((item, i) => {
          let innerValue = item === null ? '' : item.toString();
          let result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0) {
            result = '"' + result + '"'
          }
          if (i > 0) {csv += ','}
          csv += result;
        })
        csv += '\n';
        console.log('csv: ', csv)
      return csv
    }
    return [running, setRunning, scale]
  }
  
export default useMeydaAnalyser
