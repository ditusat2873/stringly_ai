const noteFromPitch = (frequency) => {
  var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
};

const frequencyFromNoteNumber = (note) => {
  return 440 * Math.pow(2, (note - 69) / 12);
};

const centsOffFromPitch = (frequency, note) => {

  console.log('centsOffFromPitch', frequency,  frequencyFromNoteNumber(note), note )
  return Math.floor(
    (1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2)
  );
};

const centsOffFromPitchUsingNotSymbol = (currentNote, noteToCompareWith) => {

  return Math.floor(
    (1200 * Math.log(noteFrequency[noteStrings.indexOf(currentNote)] / noteFrequency[noteStrings.indexOf(noteToCompareWith)])) / Math.log(2)
  );
};


const getDetunePercent = (detune) => {
  if (detune > 0) {
    return 50 + detune;
  } else {
    return 50 + -detune;
  }
};

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

const noteFrequency = [
  261.63,
  277.18,
  293.66,
  311.13,
  329.62,
  349.23,
  369.99,
  391.99,
  415.30,
  440.00,
  466.16,
  493.88
];

export { noteFromPitch, centsOffFromPitch, getDetunePercent, centsOffFromPitchUsingNotSymbol };
