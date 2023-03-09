
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
        return data.choices[0].message.content;
    })
    .catch(error => {
      console.error("Error when calling the OpenAI API", error);
    });
}

// This function parses a string containing the outline of a book (chapters and sections) and returns an object with the chapters and sections.
function parseChaptersSections(result) {
    let chapters = []; // Contains the list of the chapters
    let sections = []; // 2D array containing the sections of each chapter
    
    let currentChapter = -1; // Index of the current chapter
    let lines = result.split("\n");
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (lines[i] !== "") {
            let line = lines[i];
            if (line.startsWith("Chapter")) {
                currentChapter++;
                sections.push([]); // Add a new array for the sections of the new chapter

                // Capture the title of the chapter using regex
                let chapterTitle = line.match(/Chapter\s\d+\.\s(.*)/)[1];
                chapters.push(chapterTitle);

            }
            else if (line.startsWith("-Section")) {
                // Capture the title of the section using regex
                let sectionTitle = line.match(/-Section\s\d+:\s(.*)/)[1];
                sections[currentChapter].push(sectionTitle);
            }
        }
    }

    return { chapters, sections };
}


export default {fetchPromptResult, parseChaptersSections};