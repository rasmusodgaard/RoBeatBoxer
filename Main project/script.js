//---------------------------------------------------------------//
//----------------------- Speech Synth Init ---------------------//
//---------------------------------------------------------------//

// controller interface for the speech synthesizer
var synth = window.speechSynthesis;

// getting first instance and set up reference
var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var voiceSelect = document.querySelector('select');

// Slider object for pitch and rate
var pitch = document.querySelector('#pitch');
var rate = document.querySelector('#rate');

// Output value from sliders for pitch and rate
var pitchValue = document.querySelector('.pitch-value');
var rateValue = document.querySelector('.rate-value');

// all the different voices loaded from the API
var voices = [];

// Here all the text inputs from Fred should be saved in an array-like format
var introText = 'Whats up gangsta. Welcome to Googles hiphop beat service. I am here to make your rhymes sound tight. First you have to choose a pattern. Do you want simple, funky, or complex?';
//var introText = 'bum ti bum bum ti bum ti bum bum ti bum ti bum bum ti bum ti bum bum ti bum ti bum bum ti ';

//---------------------------------------------------------------//
//--------------------- Speech Recognition Init -----------------//
//---------------------------------------------------------------//

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
var colors = ['simple', 'funky', 'complex'];
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

// Adding the JSGF element to the recognizer list
speechRecognitionList.addFromString(grammar, 1);

// Adding the list with the grammar element inside it to the recognition object
recognition.grammars = speechRecognitionList;

// Language
recognition.lang = 'en-US';

// Do we want partial results?
recognition.interimResults = false;

// How many results from the prioritized list do we want?
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

// Generation of the string to be displayed in hints.innerHTML. Not really necessary?
var colorHTML= '';
colors.forEach(function(v, i, a){
  console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});
// Text displayed below headline. Potentially subtitles for what is being said by Fred
hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try '+ colorHTML + '.';

//----------------------------------------------------//
          //Speech Synth Functions
//----------------------------------------------------//

// Function for retrieveing all available voices and their names
// Don't meddle with this, just use it!
function populateVoiceList()
{
  voices = synth.getVoices().sort(function (a, b)
  {
    const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
    if (aname < bname) return -1;
    else if (aname == bname) return 0;
    else return +1;
  });


  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for (i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if (voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Original speak function - Sets the wheels in motion
function speak()
{
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }
  if (inputTxt.value !== '') {
    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function (event)
    {
      console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event)
    {
      console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

// Speak function overload with string input parameter
function speak(input)
{
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }
  if (input !== '') {
    var utterThis = new SpeechSynthesisUtterance(input);
    utterThis.onend = function (event)
    {
      console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event)
    {
      console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}


//----------------------------------------------------//
          //Speech Recognition Functions
//----------------------------------------------------//

// Start recognition when body is clicked, potentially another input?
document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
}

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
  diagnostic.textContent = 'Result received: ' + color + '.';

  //Background color is changed
  bg.style.backgroundColor = color;

  // confidence percentage for the result. Potentially multiply this number with Rate or Pitch
    // A way of letting the machine get agency
  console.log('Confidence: ' + event.results[0][0].confidence);
}



//----------------------------------------------------//
            //Speech Synthesys Event Handlers
//----------------------------------------------------//

// Event handler for when the form is submitted to the web API
inputForm.onsubmit = function (event)
{
  event.preventDefault();
  speak(introText);
}

// Event handler for when the pitch slider have been changed
pitch.onchange = function ()
{
  pitchValue.textContent = pitch.value;
}

// Event handler for when the rate slider have been changed
rate.onchange = function ()
{
  rateValue.textContent = rate.value;
}

// Event handler for when the voice drop down have been changed
voiceSelect.onchange = function ()
{
  speak();
}

//----------------------------------------------------//
          //Speech Recognition Event handlers
//----------------------------------------------------//

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
