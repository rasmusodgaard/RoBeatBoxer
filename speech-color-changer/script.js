// --------------------------- //
//      Speech recognition     //
// --------------------------- //

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrases = [
  "simple",
  "funky",
  "complex",
  "fast",
  "slow",
  "high",
  "low",
  "clean",
  "hard",
  "wack",
  "crazy",
  "cool"
];

var grammar =
  "#JSGF V1.0; grammar phrases; public <string> = " + phrases.join(" | ") + " ;";

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
// var introText =
//   "What's up gangsta. I'm the voice assistant Rap Machine. I am here to make your rhymes sound tight on the dopest of beats. First you have to choose a pattern. Do you want simple, funky, or complex?";
var introText = "hi";
var progress = 0;

var pattern = ["simple", "complex", "funky"];

var tempo = ["speedy", "relaxed"];
var tempospeak = "Fo sho my dude. Do you like it speedy or relaxed?";

var hilo = ["hi", "low"];
var hilospeak = "Che ki di check. So do you want it hi or lo?";

var beatboxer = ["clean", "hard", "wack", "sloppy", "cool"];
var beatboxerspeak = 
  "Now it's time to choose a beatboxer. All of them are up for some dope ass hiphop. What style are you into? Clean, cool, hard, wack or sloppy?"
;
var speaks = [introText,tempospeak,hilospeak,beatboxerspeak];
var defaultspeak = "speak up bro";

var pattern_data = [
  "boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti",
  "boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti",
  "boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti"
];

var tempo_data = [2, 1.5];

var hilo_data = [1.5, 0.5];

var beatboxer_data = ["Daniel", "Xander", "Sara", "Ting-Ting", "Diego"];

var settings = [-1,-1,-1,-1];

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
  hints.innerHTML = speaks[progress];
  if (input !== "") {
    var utterThis = new SpeechSynthesisUtterance(input);
    utterThis.onend = function(event) {
      console.log("SpeechSynthesisUtterance.onend");
      StartRecognition();
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

function StartRecognition()
{
  recognition.start();
}

// Start recognition when body is clicked, potentially another input?
document.onclick = function() {
  // recognition.start();
  // speak(introText, 1, 1, "Ting-Ting");

  if (progress == 0) {
    StartConversation();
  }
};
//bool to only start once

function StartConversation() {
  if (synth.speaking) {
    return;
  }
  speak(introText, 1, 1, "Fred");
}

// Event fired when a result is recieved back from the WebAPI
recognition.onresult = function(event) {
  console.log("on result");
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
  var result = event.results[last][0].transcript;

  // Display of the output/recognition in the HTML
  diagnostic.textContent = "Result received: " + result + ".";

  // confidence percentage for the result. Potentially multiply this number with Rate or Pitch
  // A way of letting the machine get agency
  console.log("Confidence: " + event.results[0][0].confidence);
  CheckResult(result);
};

function CheckResult(input)
{
  console.log("Checkresult: " + input + " " + progress);
  switch (progress) {
    case 0:
      FindPattern(input);
      break;
    case 1:
      FindTempo(input);
      break;

    case 2:
      FindHiLo(input);
      break;

    case 3:
      FindBeatBoxer(input);
      break;

    case 4:
      PlayBeat();
      break;

    default:
      //potentialt lav failsafe
      break;
  }
}

function FindPattern(input)
{
  console.log("Input " + input);
  switch (input) {
    case pattern[0]:
      settings[0] = 0;
      progress++;
      break;
    case pattern[1]:
      settings[0] = 1;
      progress++;
      break;
    case pattern[2]:
      settings[0] = 2;
      progress++;
      break;

    default:
      break;
  }
  speak(speaks[progress],1,1,"Fred");
}

function FindTempo(input) {
  console.log("Input " + input);
  switch (input) {
    case tempo[0]:
      settings[1] = 0;
      progress++;
      break;
    case tempo[1]:
      settings[1] = 1;
      progress++;
      break;

    default:
      break;
  }
  speak(speaks[progress], 1, 1, "Fred");
}

function FindHiLo(input) {
  console.log("Input " + input);
  switch (input) {
    case hilo[0]:
      settings[2] = 0;
      progress++;
      break;
    case hilo[1]:
      settings[2] = 1;
      progress++;
      break;

    default:
      break;
  }
  speak(speaks[progress], 1, 1, "Fred");
}

function FindBeatBoxer(input) {
  console.log("Input " + input);
  switch (input) {
    case beatboxer[0]:
      settings[3] = 0;
      progress++;
      break;
    case beatboxer[1]:
      settings[3] = 1;
      progress++;
      break;
    case beatboxer[2]:
      settings[3] = 2;
      progress++;
      break;
    case beatboxer[3]:
      settings[3] = 3;
      progress++;
      break;
    case beatboxer[4]:
      settings[3] = 4;
      progress++;
      break;

    default:
      break;
  }
  if (progress <= 3) {
    speak(speaks[progress], 1, 1, "Fred");
  } else{
    PlayBeat();
  }
}

function PlayBeat()
{
  speak(pattern_data[settings[0]],
        tempo_data[settings[1]],
        hilo_data[settings[2]],
        beatboxer_data[settings[3]]
        );
}


recognition.onspeechend = function() {
  recognition.stop();
};

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
};

recognition.onerror = function(event) {
  diagnostic.textContent = "Error occurred in recognition: " + event.error;
};
