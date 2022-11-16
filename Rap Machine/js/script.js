
var diagnostic = document.querySelector(".output");
// var bg = document.querySelector("html");
var hints = document.querySelector(".hints");

// Text displayed below headline. Potentially subtitles for what is being said by Fred
hints.innerHTML = "Click to begin!";

var myDiv = document.getElementById("myDiv");

//Create and append select list
var selectList = document.createElement("select");
selectList.setAttribute("id", "mySelect");
myDiv.appendChild(selectList);

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

var introText = "yo!";
// var introText = "What's up gangsta. I'm the voice assistant Rap Machine. I am here to make your rhymes sound tight on the dopest of beats. First you have to choose a pattern. Do you want simple, funky, or complex?";
var progress = 0;

var pattern = ["simple", "complex", "funky"];

var tempo = ["speedy", "relaxed"];
var tempospeak = "Fo sho my dude. Do you like it speedy or relaxed?";

var hilo = ["hi", "low"];
var hilospeak = "Che ki di check. So do you want it hi or lo?";

var beatboxer = ["clean", "hard", "wack", "crazy", "cool"];
var bbImg = ["img/clean.gif", "img/hard.gif", "img/wack.gif", "img/crazy.gif", "img/cool.gif"];

var beatboxerspeak = "Now it's time to choose a beatboxer. All of them are up for some dope ass hiphop. What style are you into? Clean, cool, hard, wack or crazy?";
var speaks = [introText, tempospeak, hilospeak, beatboxerspeak];
var defaultspeak = "speak up bro";

var pattern_data = ["boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti", "boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti", "boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti"];

var tempo_data = [2, 1];

var hilo_data = [1.5, 0.5];

// var beatboxer_data = ["Daniel", "Xander", "Sara", "Ting-Ting", "Diego"];
var beatboxer_data = ["en_GB", "nl_NL", "da_DK", "zh_CN", "es_AR"];

var settings = [-1, -1, -1, -1];

var choices = [pattern, tempo, hilo, beatboxer];
// Function for retrieveing all available voices and their names
function populateVoiceList() {
    voices = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(),
            bname = b.name.toUpperCase();

        if (aname < bname) {
            return -1;
        }

        else if (aname == bname) {
            return 0;
        }

        else {
            return + 1;
        }
    });

    // Debug available voices
    console.log("Number of voices: " + voices.length);
    voices.forEach(element => {
        console.log(element.name);
    });
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

function ShowUserOptions(arrayOfChoices) {
    //Clear list
    selectList.options.length = 0;

    //Create and append the options
    for (var i = 0; i < arrayOfChoices.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", arrayOfChoices[i]);
        option.text = arrayOfChoices[i];
        selectList.appendChild(option);
    }
}

function speak(input, pitch, rate, voice) {
    if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
    }

    hints.innerHTML = speaks[progress];

    if (input !== "") {
        var utterThis = new SpeechSynthesisUtterance(input);
        utterThis.onend = function (event) {
            console.log("SpeechSynthesisUtterance.onend");
            ShowUserOptions(choices[progress]);
        };
        utterThis.onerror = function (event) {
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
document.onclick = function () {
    // recognition.start();
    // speak(introText, 1, 1, "Ting-Ting");

    if (progress == 0) {
        StartConversation();
    }
};
// bool to only start once

function StartConversation() {
    if (synth.speaking) {
        return;
    }
    speak(introText, 1, 1, "en_US");
}


function CheckResult(input) {
    switch (progress) {
        case 0: FindPattern(input);
            break;
        case 1: FindTempo(input);
            break;

        case 2: FindHiLo(input);
            break;

        case 3: FindBeatBoxer(input);
            break;

        case 4: PlayBeat();
            break;

        default:
            // potentielt lav failsafe
            break;
    }
}

function FindPattern(input) {
    var processedResult = CheckAlternatives(input, pattern);
    switch (processedResult) {
        case pattern[0]: settings[0] = 0;
            progress++;
            break;
        case pattern[1]: settings[0] = 1;
            progress++;
            break;
        case pattern[2]: settings[0] = 2;
            progress++;
            break;

        default:
            break;
    }
    speak(speaks[progress], 1, 1, "Fred");
}

function FindTempo(input) {
    var processedResult = CheckAlternatives(input, tempo);
    switch (processedResult) {
        case tempo[0]: settings[1] = 0;
            progress++;
            break;
        case tempo[1]: settings[1] = 1;
            progress++;
            break;

        default:
            break;
    }
    speak(speaks[progress], 1, 1, "Fred");
}

function FindHiLo(input) {
    var processedResult = CheckAlternatives(input, hilo);
    switch (processedResult) {
        case hilo[0]: settings[2] = 0;
            progress++;
            break;
        case hilo[1]: settings[2] = 1;
            progress++;
            break;

        default:
            break;
    }
    speak(speaks[progress], 1, 1, "Fred");
}

function FindBeatBoxer(input) {
    var processedResult = CheckAlternatives(input, beatboxer);
    switch (processedResult) {
        case beatboxer[0]: settings[3] = 0;
            progress++;
            break;
        case beatboxer[1]: settings[3] = 1;
            progress++;
            break;
        case beatboxer[2]: settings[3] = 2;
            progress++;
            break;
        case beatboxer[3]: settings[3] = 3;
            progress++;
            break;
        case beatboxer[4]: settings[3] = 4;
            progress++;
            break;

    }
    if (progress <= 3) {
        speak(speaks[progress], 1, 1, "Fred");
    }
    else {
        document.getElementById("cassette").src = bbImg[settings[3]];
        document.getElementById("cassette").style.visibility = "visible";

        PlayBeat();
    }
}

function PlayBeat() {
    speak(pattern_data[settings[0]], tempo_data[settings[1]], hilo_data[settings[2]], beatboxer_data[settings[3]]);
}