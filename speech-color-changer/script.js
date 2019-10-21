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

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
