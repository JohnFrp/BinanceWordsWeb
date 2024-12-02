document.getElementById("fetchButton").addEventListener("click", async () => {
    const url = document.getElementById("url").value;
    const minLength = parseInt(document.getElementById("minLength").value, 10);
    const maxLength = parseInt(document.getElementById("maxLength").value, 10);

    if (!url || !minLength || !maxLength) {
        alert("Please fill in all fields!");
        return;
    }

    try {
        // Fetch webpage content using a proxy (to bypass CORS)
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, "text/html");

        // Extract words from <ul><li> elements
        const words = [];
        doc.querySelectorAll("ul li").forEach(li => {
            const word = li.textContent.trim();
            if (word.length >= minLength && word.length <= maxLength && word === word.toUpperCase()) {
                words.push(word);
            }
        });

        // Remove duplicates and sort words
        const uniqueWords = [...new Set(words)].sort();

        // Group words by their lengths
        const groupedWords = uniqueWords.reduce((groups, word) => {
            const length = word.length;
            if (!groups[length]) groups[length] = [];
            groups[length].push(word);
            return groups;
        }, {});

        // Display results
        const output = document.getElementById("output");
        output.innerHTML = ""; // Clear previous output

        if (Object.keys(groupedWords).length === 0) {
            output.innerHTML = "<p>No words found!</p>";
        } else {
            for (const [length, words] of Object.entries(groupedWords)) {
                const section = document.createElement("div");
                section.innerHTML = `<h3>${length} - Letter Words:</h3><ul>${words.map(word => `<li>${word}</li>`).join("")}</ul>`;
                output.appendChild(section);
            }
        }
    } catch (error) {
        console.error("An error occurred:", error);
        document.getElementById("output").innerHTML = `<p>Error fetching data. Please try again.</p>`;
    }
});
