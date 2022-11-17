
var diagnostic = document.querySelector(".output");
// var bg = document.querySelector("html");
var hints = document.querySelector(".hints");

// Text displayed below headline. Potentially subtitles for what is being said by Fred
hints.innerHTML = "Click to begin!";

var dropdown = document.getElementById("optionsSelect");
var startbutton = document.getElementById("startbutton");
//Create and append select list

// --------------------------- //
//       Speech synthesis      //
// --------------------------- //

// controller interface for the speech synthesizer
var synth = window.speechSynthesis;

var progress = 0;
var hasPlayedBeat = false;

// all the different voices loaded from the API
var voices = [];
var voiceSelect = document.querySelector("select");

// Additional variables for Speech Synth
var rate = 1;
var pitch = 1;

// Here all the text inputs from Fred should be saved in an array-like format
var introText = "What's up gangsta. I'm the voice assistant Rap Machine. I am here to make your rhymes sound tight on the dopest of beats. First you have to choose a pattern. Do you want simple, funky, or complex?";
var hostVoice = "de-DE";
var pattern = ["simple", "complex", "funky"];

var tempo = ["speedy", "relaxed"];
var tempospeak = "Fo sho my dude. Do you like it speedy or relaxed?";

var hilo = ["hi", "low"];
var hilospeak = "Che ki di check. So do you want it hi or lo?";

var beatboxer = ["clean", "hard", "wack", "crazy", "cool"];
var bbImg = ["img/clean.gif", "img/hard.gif", "img/wack.gif", "img/crazy.gif", "img/cool.gif"];

var beatboxerspeak = "Now it's time to choose a beatboxer. All of them are up for some dope ass hiphop. What style are you into? Clean, hard, wack, crazy or cool?";
var speaks = [introText, tempospeak, hilospeak, beatboxerspeak];
var defaultspeak = "speak up bro";

var pattern_data = [
    "boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti boom ti clap ti",
    "boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti boom boom clap ti boom ti clap ti",
    "boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti boom ti clap ti boom boom clap ti boom ti clap clap boom ti clap ti"];

var tempo_data = [2, 1];

var hilo_data = [1.5, 0.5];

// var beatboxer_data = ["Daniel", "Xander", "Sara", "Ting-Ting", "Diego"];
var beatboxer_data = ["en-GB", "nl-NL", "fr-FR", "zh-CN", "es-ES"];

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
        console.log(element.lang);
    });
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

function ShowUserOptions(arrayOfChoices) {
    //Clear list
    dropdown.options.length = 0;

    var option = document.createElement("option");
    option.setAttribute("value", "none");
    option.selected = true;
    option.disabled = true;
    option.hidden = true;
    option.text = "Select an Option";
    dropdown.appendChild(option);

    //Create and append the options
    for (var i = 0; i < arrayOfChoices.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", arrayOfChoices[i]);
        option.text = arrayOfChoices[i];
        dropdown.appendChild(option);
    }

    dropdown.style.visibility = "visible";
}

function speak(input, pitch, rate, voice) {

    console.log("Play function:");
    console.log(input);
    console.log(pitch);
    console.log(rate);
    console.log(voice);

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

        voices.forEach(element => {
            if (element.lang === voice) {
                utterThis.voice = element;
            }

        });

        utterThis.pitch = pitch;
        utterThis.rate = rate;
        synth.speak(utterThis);
        dropdown.style.visibility = "hidden";
    }
}

startbutton.onclick = function () {
    if (progress == 0) {
        startbutton.style.visibility = "hidden";
        StartConversation();
    }
};

function StartConversation() {
    if (synth.speaking) {
        return;
    }
    speak(introText, 1, 1, hostVoice);
}

function SetOption(dropdown) {
    var selectedValue = dropdown.value;
    CheckResult(selectedValue);
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
    console.log(input);

    switch (input) {
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
    speak(speaks[progress], 1, 1, hostVoice);
}

function FindTempo(input) {
    console.log(input);
    switch (input) {
        case tempo[0]: settings[1] = 0;
            progress++;
            break;
        case tempo[1]: settings[1] = 1;
            progress++;
            break;

        default:
            break;
    }
    speak(speaks[progress], 1, 1, hostVoice);
}

function FindHiLo(input) {
    console.log(input);

    switch (input) {
        case hilo[0]: settings[2] = 0;
            progress++;
            break;
        case hilo[1]: settings[2] = 1;
            progress++;
            break;

        default:
            break;
    }
    speak(speaks[progress], 1, 1, hostVoice);
}

function FindBeatBoxer(input) {
    console.log(input);

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

        default: {
            console.log(input + " is not  valid beatboxer");
        }

    }

    document.getElementById("cassette").src = bbImg[settings[3]];
    document.getElementById("cassette").style.visibility = "visible";

    PlayBeat();
}

function PlayBeat() {
    speak(pattern_data[settings[0]], tempo_data[settings[1]], hilo_data[settings[2]], beatboxer_data[settings[3]]);

}