//HTML document needs to fully load before running js or errors may occur
window.onload=function() {

// Global Variables
// -------------------------------------------
const subbtn = document.querySelector("#sub-button")
const restartbtn = document.querySelector("#restart");
const textbtn = document.querySelector("#new-text");
const text = document.querySelector("#typing-box");
const dropdownChoice = document.querySelector(".select-box");
const wpmHTML = document.querySelector(".WPM");
const cpmHTML = document.querySelector(".CPM");

var testText = document.querySelector("#quote-api");
var APIurl = " "; // change the API url to request from based on user input
var minutes = 0, seconds = 0, ms = 0; // starting value for the timer
var alertMessage = "Congratulations, you completed the test in "  + minutes + " minutes and " + seconds + "." + ms + " seconds";
var interval;
var completeRandomText = "";
var APItextData = "abc";
var spanArray=[];
var letterArray=[];
var WPM = 0;
var CPM = 0;
var numWords = 0;
var letterIndex = 0; var wordIndex = 0;
var numberOfMistakes = 0;
var randomLetter; var randomWordsString = "";


// Function Defitions
// -------------------------------------------------------
function dropdownSelection() {
	console.log(dropdownChoice.value);
	
	switch(dropdownChoice.value){
		case 'quote':
			APIurl = "https://talaikis.com/api/quotes/random/";
			break;
		case 'alphanumeric':	
			APIurl = "https://talaikis.com/api/quotes/random/";
			break;
		case 'paragraph':
			APIurl = "https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1";
			break;
		case 'words':
			APIurl = "https://api.datamuse.com/words?sp="+randomLetter+"*";
			break;
		}
}

// adds the leading zeros to the timer when they're single digit
function displayZero(time){
	if(time <= 9) {
		time = "0" + time;
	}
	return time;
}

// concatenates the different timer values with colons to display timer up to minutes
function runTimer(){
	document.querySelector(".timer").innerHTML= displayZero(minutes) + ":" + displayZero(seconds) + ":" + displayZero(ms);
	ms++;

	displayWPM_and_CPM(minutes, seconds);
	createHTML();

	// time conversions
	if(seconds == "60"){
		seconds = "0";
		minutes++;
	}

	if(ms === 100){
			ms=0;
		seconds++;
		//console.log(seconds);
	}
}

// checks when user begins typing, then calls runTimer to start the timer
function startTimer(){
	let textLength = text.value.length;

	if(textLength === 0){
		interval = setInterval(runTimer, 10) // run function every hundred of a second
	}
}

// reset timer and input box when button is pressed
function restartTest(){
	clearInterval(interval);
	document.querySelector(".timer").innerHTML = "00:00:00";
	text.value = "";
	minutes = 0; seconds = 0; ms = 0;
	text.style.border = "6px solid grey";
	wpmHTML.innerHTML = "WPM: 00";
	cpmHTML.innerHTML = "CPM: 00";
	letterIndex = 0;
	wordIndex = 0;
	WPM = 0;
	CPM = 0;
	numWords = 0;
	numberOfMistakes = 0;
}

// counts the number of words by counting spaces (may be slightly inaccurate)
// - have not accounted for backspaces (will add an extra word if included a space)
//   and last word of the entire text (ends with a period, but so do all sentences)
function countWords(){
	let textLength = text.value.length;
	// create a substring that checks if each new key typed is a space	
	if(text.value.substring((textLength-1), (textLength)) == " ")
		numWords++;
}

// calculates and displays the words per min and characters per min
function displayWPM_and_CPM(mins, secs){
	let totalSeconds = (mins*60) + secs;
	let textInput = text.value;
	let numChars = textInput.length;
	let wpmHTML2 = "CPM: " + CPM;
	let cpmHTML2 = "WPM: " + WPM;
	CPM = Math.floor((numChars / totalSeconds) * 60); // characters per min
	WPM = Math.floor((numWords / totalSeconds) * 60); // words per min
	wpmHTML.innerHTML = wpmHTML2;
	cpmHTML.innerHTML = cpmHTML2;	
}

// check if input text equals test text, then changes border color accordingly
function checkStringEquality() {
	var textInput = text.value;
	var completeTestText;
	var parsedTestText;

	if(dropdownChoice.value == 'alphanumeric'){
		completeTestText = completeRandomText;
		parsedTestText = completeRandomText.substring(0,(textInput.length));
	}
	// testTest.innerHTML is full of spans when createHTML is called
	// so use global variable APItextData instead
	else {
		completeTestText = APItextData;
		parsedTestText = APItextData.substring(0,(textInput.length));
	}

	// check for equality to input
	if(textInput == completeTestText){
		text.style.border = "8px solid green";
		clearInterval(interval);
		alert(("Congratulations! You completed the " + dropdownChoice.value + " test in " + minutes + " minutes and " + seconds + "." + ms + " seconds!"));
		alert(("You made " + numberOfMistakes + " mistakes."));
		console.log(numberOfMistakes);
	}
		else if(textInput == parsedTestText){
			text.style.border = "8px solid lightblue";
		}
		else{
			text.style.border = "8px solid pink";
			numberOfMistakes++;
		}
}
	
// checks for character equality to input text and highlights the word
function highlightWords(){
	var textInput = text.value;
	var textLength = textInput.length;
	var inputLetter = textInput.substring((textLength-1), (textLength));

	// dont listen for shift and ctrl
	if(event.which != 16 && event.which != 17){
		if(dropdownChoice.value == 'alphanumeric'){
			if(event.which == 8){
				console.log(letterIndex);
				letterArray[(letterIndex-1)].style.background = "lightblue";
				letterIndex = letterIndex-2;
			}
			var completeTestText = completeRandomText;
			var parsedTestText = completeRandomText.substring(0,(textInput.length));
			var textInput = text.value;

			if(textInput == parsedTestText){
				console.log(textInput);
				console.log(parsedTestText);
				letterArray[letterIndex].style.background = "green";
				letterArray[letterIndex].style.borderBottom = "2px solid black"
				letterIndex++;
			}
			else{
				letterArray[letterIndex].style.background = "red";	
				console.log(textInput);
				console.log(parsedTestText);			
				letterIndex++;
			}
		}

		// non-alphanumeric tests
		else{
			if(letterArray[letterIndex] == inputLetter){
				letterIndex++;
				spanArray[wordIndex].style.background = "green";
				spanArray[wordIndex].style.borderRadius = "5px";
				if(letterArray[letterIndex] == " "){
					spanArray[wordIndex].style.background = "lightgreen";
					spanArray[wordIndex].style.color = "white";
					spanArray[wordIndex].style.borderRadius = "5px";
					wordIndex++;
				}
			}
			else {
				console.log(inputLetter);
				console.log(letterArray[letterIndex]);
				spanArray[wordIndex].style.background = "red";
				spanArray[wordIndex].style.borderRadius = "5px";
			}
		}
	}
}

// creates an array of the text parsed into letters
function createLetterArray(){
	for(i=0; i<spanArray.length; i++){
		var separatedWord = spanArray[i].innerHTML;
		console.log(separatedWord);
		separatedLetter = separatedWord.split("");
		for(j=0; j<separatedWord.length; j++){
			letterArray.push(separatedLetter[j]);
		}
	}
	console.log(letterArray);
}

// function creates a string a random alphanumberic characters
// change the value of the second parameter of the for loop to control length
function createRandomText() {
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  testText.innerHTML = "";
  letterArray = [];
  completeRandomText = "";

  for (var i = 0; i < 50; i++) {
  		let randomChar = possible.charAt(Math.floor(Math.random() * possible.length));
  		completeRandomText += randomChar;
  		let separatedRandomChar = document.createElement("span");
  		let node = document.createTextNode(randomChar);
  		separatedRandomChar.appendChild(node);
  		letterArray.push(separatedRandomChar);
  		testText.appendChild(separatedRandomChar);
	}
}

// takes the response text from the API call and splits it into an array of substrings
// containing each separated word
// It creates a span HTML element to separate every word from the text
function createHTML(APIdata, isAPItext){
	// only create the HTML elements if data is from an API call
	if(isAPItext){
		console.log(APIdata);
		var testTextValue = APIdata;
		var separatedText = testTextValue.split(" ");
		console.log(separatedText);
		// reset the contents of the array to store new data when called again
		spanArray = [];
		letterArray = []; 
		testText.innerHTML = ""; // reset current html for appendage below

		for(i = 0; i<separatedText.length; i++){
			var separatedWord = document.createElement("span");
			var node = document.createTextNode((separatedText[i] + " "));
			separatedWord.appendChild(node);
			spanArray.push(separatedWord); 
			testText.appendChild(separatedWord);
		}
		createLetterArray();
	}
}


// create a string of a lot of words through concatenation
function createRandomWordsString(){
	randomWordsString = "";

	for(i=6;i<60;i++)
		randomWordsString = APItextData[i].word + " " + randomWordsString;

	console.log(randomWordsString);
}

// selects the type of text and passes the corresponding response text from 
// the API call to the createHTML function
function changeTestText() {
	restartTest();
	var isAPItext;

	if(dropdownChoice.value == 'words'){
		createRandomWordsString();
	}

	// changes innerHTML based on what is selected from the dropdown menu
	if(dropdownChoice.value == 'quote'){
		isAPItext = true;
		APItextData = APItextData.quote;
		createHTML(APItextData, isAPItext);
	}
	else if(dropdownChoice.value == 'alphanumeric')
		createRandomText();
	else if(dropdownChoice.value == 'paragraph'){
		isAPItext = true;
		APItextData = APItextData[0];
		createHTML(APItextData, isAPItext);
	}
	else if(dropdownChoice.value == 'words'){
		APItextData = randomWordsString;
	  	isAPItext = true;
		createHTML(APItextData, isAPItext);
	}
}

// makes the API request to the designated server and sends the reponse text to 
// changeTestText as a callback
function APIcall(callback){

	var possibleChars = "abcdefghijklmnopqrstuvwxyz";
	randomLetter = possibleChars.charAt(Math.floor(Math.random()*possibleChars.length));

  	dropdownSelection();

	let AJAXrequest = new XMLHttpRequest();
	AJAXrequest.onload = function(){
		if(AJAXrequest.status == 200){	
			APItextData = JSON.parse(AJAXrequest.responseText);
			console.log(APItextData);
			callback();
		}
		else if(AJAXrequest.status == 400)
			console.log("error 400");
		else
			console.log("failed to load for some reason");
	};
	AJAXrequest.open('GET', APIurl);
	AJAXrequest.send();
}

// main()
// ----------------------------------------------------
text.addEventListener("keyup", checkStringEquality, false);
text.addEventListener("keydown", highlightWords, false);
text.addEventListener("keypress", startTimer, false);
text.addEventListener("keyup", countWords, false);
textbtn.addEventListener("click", function(){ APIcall(changeTestText)});
restartbtn.addEventListener("click", restartTest, false);
}
