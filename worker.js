export default {
    async fetch(request) {
      const url = new URL(request.url);
      const targetUrl = url.searchParams.get("targetUrl");
      const minLength = parseInt(url.searchParams.get("minLength"), 10);
      const maxLength = parseInt(url.searchParams.get("maxLength"), 10);
  
      if (!targetUrl || isNaN(minLength) || isNaN(maxLength)) {
        return new Response(
          JSON.stringify({ error: "Missing or invalid query parameters" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      try {
        // Fetch the target URL
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch target URL: ${response.statusText}`);
        }
  
        const { contents } = await response.json();
  
        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(contents, "text/html");
  
        // Extract and filter words
        const words = [];
        doc.querySelectorAll("ul li").forEach(li => {
          const word = li.textContent.trim();
          if (word.length >= minLength && word.length <= maxLength && word === word.toUpperCase()) {
            words.push(word);
          }
        });
  
        // Remove duplicates, sort, and group words by their lengths
        const uniqueWords = [...new Set(words)].sort();
        const groupedWords = uniqueWords.reduce((groups, word) => {
          const length = word.length;
          if (!groups[length]) groups[length] = [];
          groups[length].push(word);
          return groups;
        }, {});
  
        return new Response(JSON.stringify(groupedWords), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    },
  };
  