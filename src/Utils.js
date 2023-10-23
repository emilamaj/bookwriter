
// This function returns the result of a single prompt submitted to the gpt-3.5-turbo API.
// The result is given as a promise that must be resolved.
function fetchPromptResult(prompt) {
    let url = "https://api.openai.com/v1/chat/completions"
    let apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    // Regex validate the API key format.
    let regex = /^sk-[a-zA-Z0-9]{48}$/;
    if (!apiKey || !regex.test(apiKey)) {
        console.log("Invalid OpenAI API key. Please check that the key stored in the .env file is valid.");
        throw new Error("Invalid OpenAI API key.");
    }
    
    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
    }

    let model = "gpt-3.5-turbo"
    let messages = [{"role": "user", "content": prompt}]
    let promptTokensApprox = prompt.split(" ").length;
    let data = {
        "model": model,
        "messages": messages,
        // Model limit is 4096 tokens, take crude estimation of prompt token count, with some margin for safety.
        "max_tokens": Math.floor(4096 - 1.5*promptTokensApprox - 100),
        "temperature": 0.3,
    }

    let payload = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    }

    console.log("Sending API request to OpenAI...");

    return fetch(url, payload)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} statusText: ${response.statusText} raw response: ${response}`);
      }
      return response.json();
    }).then(data => {
        console.log("Received data: ", data);
        return data.choices[0].message.content;
    })
    .catch(error => {
      console.error(`Error when querying API: ${error}`);
      console.error("You can test your API access at https://platform.openai.com/playground")
    });
}

// This function parses a string containing the outline of a book (chapters, sections and items) and returns an object with the chapters, sections and items in 1D, 2D, 3D arrays.
function parseOutline(result) {
    let chapters = []; // Contains the list of the chapters
    let sections = []; // 2D array containing the sections of each chapter
    let items = []; // 3D array containing the items of each section of each chapter
    let parts = []; // 4D array containing the parts of each item of each section of each chapter
    let content = []; // 4D array containing the content corresponding to each part of each item of each section of each chapter
    
    let currentChapter = -1; // Index of the current chapter
    let currentSection = -1; // Index of the current section
    let lines = result.split("\n");
    // We ignore all the lines preceding the "# Outline"
    let outlineIndex = lines.findIndex(line => line.startsWith("# Outline"));
    lines = lines.slice(outlineIndex+1);
    for (let i = 0; i < lines.length; i++) {
        // Remove leading and trailing spaces, and tabs
        let line = lines[i].trim();
        line = line.replace(/\t/g, "");
        if (line !== "") {

            if (line.startsWith("Chapter")) {
                currentChapter++;
                currentSection = -1;
                sections.push([]); // Add a new array for the sections of the new chapter
                items.push([]); // Add a new array for the items of the new chapter
                parts.push([]); // Add a new array for the parts of the new chapter
                content.push([]); // Add a new array for the content of the new chapter

                // Capture the title of the chapter using regex
                // Match "Chapter 1. Introduction" or "Chapter 1: Introduction"
                let chapterTitle = line.match(/Chapter\s\d+\.\s(.*)/)[1];
                chapters.push(chapterTitle);
            }
            else if (line.startsWith("Section")) {
                currentSection++;
                items[currentChapter].push([]); // Add a new array for the items of the new section
                parts[currentChapter].push([]); // Add a new array for the parts of the new section
                content[currentChapter].push([]); // Add a new array for the content of the new section
                // Capture the title of the section using regex
                // Match "Section 1. Overview" or "Section 1: Overview"
                let sectionTitle = line.match(/Section\s\d+\.\s(.*)/)[1];
                sections[currentChapter].push(sectionTitle);
            }
            else if (line.startsWith("-")) {
                items[currentChapter][currentSection].push(line.substring(1));
                parts[currentChapter][currentSection].push([""]); // Add a new array for the parts of the new item
                content[currentChapter][currentSection].push([""]); // Add a new array for the content of the new item
            }
        }
    }

    return { chapters, sections, items, parts, content };
}

// This function parses a string containing different parts of a book item and returns an array with the parts.
function parseParts(result) {
    let parts = [];
    let lines = result.split("\n");
    for (let i = 0; i < lines.length; i++) {
        // Remove leading and trailing spaces, and leading "-"
        let line = lines[i].trim();
        line = line.replace(/^-/, "");
        if (line !== "") {
            parts.push(line);
        }
    }

    return parts;
}



export default {fetchPromptResult, parseOutline, parseParts};
