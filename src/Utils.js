
// This function returns the result of a single prompt submitted to the gpt-3.5-turbo API.
// The result is given as a promise that must be resolved.
function fetchPromptResult(prompt) {
    let url = "https://api.openai.com/v1/chat/completions"
    let apiKey = process.env.REACT_APP_OPENAI_API_KEY
    
    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
    }

    let model = "gpt-3.5-turbo"
    let messages = [{"role": "user", "content": prompt}]
    let data = {
        "model": model,
        "messages": messages,
        "max_tokens": 2000,
        "temperature": 0.3,
    }

    let payload = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    }

    return fetch(url, payload)
    .then(response => {
      if (!response.ok) {
        throw new Error("Fetch error");
      }
      return response.json();
    }).then(data => {
        console.log("Received data: ", data);
        return data.choices[0].message.content;
    })
    .catch(error => {
      console.error("Error when calling the OpenAI API", error);
    });
}

// This function parses a string containing the outline of a book (chapters, sections and items) and returns an object with the chapters, sections and items in 1D, 2D, 3D arrays.
function parseOutline(result) {
    let chapters = []; // Contains the list of the chapters
    let sections = []; // 2D array containing the sections of each chapter
    let items = []; // 3D array containing the items of each section of each chapter
    
    let currentChapter = -1; // Index of the current chapter
    let currentSection = -1; // Index of the current section
    let lines = result.split("\n");
    for (let i = 0; i < lines.length; i++) {
        // Remove leading and trailing spaces, and tabs
        let line = lines[i].trim();
        line = line.replace(/\t/g, "");
        if (line !== "") {
            console.log("line: ", line)

            if (line.startsWith("Chapter")) {
                console.log("Chapter found")
                currentChapter++;
                currentSection = -1;
                sections.push([]); // Add a new array for the sections of the new chapter
                items.push([]); // Add a new array for the items of the new chapter

                // Capture the title of the chapter using regex
                // Match "Chapter 1. Introduction" or "Chapter 1: Introduction"
                let chapterTitle = line.match(/Chapter\s\d+\.\s(.*)/)[1];
                chapters.push(chapterTitle);
            }
            else if (line.startsWith("Section")) {
                console.log("Section found")
                currentSection++;
                items[currentChapter].push([]); // Add a new array for the items of the new section
                // Capture the title of the section using regex
                // Match "Section 1. Overview" or "Section 1: Overview"
                let sectionTitle = line.match(/Section\s\d+\.\s(.*)/)[1];
                sections[currentChapter].push(sectionTitle);
            }
            else if (line.startsWith("-")) {
                console.log("Item found")
                items[currentChapter][currentSection].push(line.substring(1));
            }
        }
    }

    return { chapters, sections, items };
}


export default {fetchPromptResult, parseOutline};