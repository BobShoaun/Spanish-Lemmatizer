const definitionsFile = "./example_definitions.txt";
const inputFile = "./example_input.txt";
const outputFile = "output.txt";

// const definitionsFile = "./shortened_definitions.txt"
// const inputFile = "./new_text.txt";

const readline = require("readline");
const fs = require("fs");

let terms = [];

readDefinitionsFile();

// first reads the definitions - list of text and its replacements
function readDefinitionsFile() {
	const readInterface = readline.createInterface({
		input: fs.createReadStream(definitionsFile),
		console: false,
	});

	readInterface
		.on("line", line => {
			terms.push(line);
		})
		.on("close", () => { // EOF
			for (let i = 0; i < terms.length; i++)
				terms[i] = terms[i].split(" ");
			
			// console.log(terms);

			console.log("read to the end of file");
			readInputFile(); // then read the text file to process
		});
}

function readInputFile() {
	stream = fs.createReadStream(inputFile);
	stream.on("data", data => {
		console.log("processing...");
		let chunk = data.toString();

		// processing text file and modifying terms
		chunk = chunk.replace(/[\?¿!¡«»“”'".,:;()*-]/g, "");
		chunk = chunk.replace(/\r\n/g, " \r\n ");
		chunk = chunk.toLowerCase();
		// let words = chunk.split(/\s+/);
		let words = chunk.split(" ");
		words = words.filter(w => w !== "" && w !== undefined && w !== null);
		// console.log(chunk);
		// console.log(words);

		for (let i = 0; i < words.length; i++) {
			for (let j = 0; j < terms.length; j++) {
				if (words[i] == terms[j][0]) {
					console.log("found match", words[i], terms[j][1]);
					words[i] = terms[j][1];
					break;
				}
			}
		}

		let finalText = "";
		for (let i = 0; i < words.length; i++) {
			finalText += words[i];
			if (words[i] !== "\r\n") finalText += " ";
		}
		console.log("done processing");
		writeOutputFile(finalText); // write processed text to output file
	});
}

function writeOutputFile(text) {
	fs.appendFile(outputFile, text, err => {
		console.log("writing to output...");
		if (err) return console.log(err);
		console.log("The file was saved!");
	});
}
