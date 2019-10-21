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


// Function for retrieveing all available voices and their names
// Don't meddle with this, just use it!
function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });


  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
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
function speak(){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (inputTxt.value !== '') {
    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
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

// Event handler for when the form is submitted to the web API
inputForm.onsubmit = function(event) {
  event.preventDefault();
  speak(introText);
}

// Event handler for when the pitch slider have been changed
pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
}

// Event handler for when the rate slider have been changed
rate.onchange = function() {
  rateValue.textContent = rate.value;
}

// Event handler for when the voice drop down have been changed
voiceSelect.onchange = function(){
  speak();
}
