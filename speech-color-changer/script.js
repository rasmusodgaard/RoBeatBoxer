// --------------------------- //
//      Speech recognition     //
// --------------------------- //

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var colors = ["simple", "funky", "complex"];
var grammar =
  "#JSGF V1.0; grammar colors; public <color> = " + colors.join(" | ") + " ;";

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

// Adding the JSGF element to the recognizer list
speechRecognitionList.addFromString(grammar, 1);

// Adding the list with the grammar element inside it to the recognition object
recognition.grammars = speechRecognitionList;

// Language
recognition.lang = "en-US";

// Do we want partial results?
recognition.interimResults = false;

// How many results from the prioritized list do we want?
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector(".output");
var bg = document.querySelector("html");
var hints = document.querySelector(".hints");

// Text displayed below headline. Potentially subtitles for what is being said by Fred
hints.innerHTML = "Yoyo Gangsta";

// --------------------------- //
//       Speech synthesis      //
// --------------------------- //

// controller interface for the speech synthesizer
var synth = window.speechSynthesis;

// all the different voices loaded from the API
var voices = [];
var voiceSelect = document.querySelector("select");

// Additional variables for Speech Synth
var rate = 1;
var pitch = 1;

// Here all the text inputs from Fred should be saved in an array-like format
var introText = "Whats up gangsta. Welcome to Googles hiphop beat service";
//var introText = 'bum ti bum bum ti bum ti bum bum ti bum ti bum bum ti bum ti bum bum ti bum ti bum bum ti ';

// Function for retrieveing all available voices and their names
// Don't meddle with this, just use it!
function populateVoiceList() {
  voices = synth.getVoices().sort(function(a, b) {
    const aname = a.name.toUpperCase(),
      bname = b.name.toUpperCase();
    if (aname < bname) return -1;
    else if (aname == bname) return 0;
    else return +1;
  });
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(input, pitch, rate, voice) {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }
  if (input !== "") {
    var utterThis = new SpeechSynthesisUtterance(input);
    utterThis.onend = function(event) {
      console.log("SpeechSynthesisUtterance.onend");
    };
    utterThis.onerror = function(event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };
    for (i = 0; i < voices.length; i++) {
      if (voices[i].name === voice) {
        utterThis.voice = voices[i];
        break;
      }
    }

    utterThis.pitch = pitch;
    utterThis.rate = rate;
    synth.speak(utterThis);
  }
}

// Start recognition when body is clicked, potentially another input?
document.body.onclick = function() {
  recognition.start();
  // speak(introText, 1, 1, "Ting-Ting");
};

// Event fired when a result is recieved back from the WebAPI
recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The [last] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object

  //Index for the newest result. Earlier results are saved in the object as well
  var last = event.results.length - 1;

  // String containing the result. This is what we should compare with our grammar
  var color = event.results[last][0].transcript;

  // Display of the output/recognition in the HTML
  diagnostic.textContent = "Result received: " + color + ".";

  //Background color is changed
  bg.style.backgroundColor = color;
  speak(color, 1,1, "Ting-Ting");
  // confidence percentage for the result. Potentially multiply this number with Rate or Pitch
  // A way of letting the machine get agency
  console.log("Confidence: " + event.results[0][0].confidence);
};

recognition.onspeechend = function() {
  recognition.stop();
};

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
};

recognition.onerror = function(event) {
  diagnostic.textContent = "Error occurred in recognition: " + event.error;
};
