import requests
from bs4 import BeautifulSoup

# Function to fetch and filter words from the webpage
def fetch_and_filter_words(url, min_length, max_length):
    # Set up headers to avoid being blocked by the website
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        # Fetch the content of the webpage
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for HTTP errors

        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract additional info lists
        filtered_words = []
        for ul in soup.find_all('ul'):  # Iterate through all unordered lists
            for li in ul.find_all('li'):
                word = li.text.strip()
                # Check if the word length is within the specified range and is uppercase
                if min_length <= len(word) <= max_length and word.isupper():
                    filtered_words.append(word)

        if not filtered_words:
            print(f"No words found with length between {min_length} and {max_length}.")
        
        return filtered_words  # Return the collected words

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return []

# URL of the webpage
url = "https://shoptips24.com/binance-word-of-the-day-answer-today"

# Define the length range
min_length = 3  # Minimum word length
max_length = 8  # Maximum word length

# Call the function to fetch and filter words and capture the result
words_array = fetch_and_filter_words(url, min_length, max_length)

# Remove duplicates and sort the words
unique_words = sorted(set(words_array))

# Initialize a dictionary to group words by their lengths
grouped_words = {}

# Group words by their lengths
for word in unique_words:
    word_length = len(word)
    grouped_words.setdefault(word_length, []).append(word)

# Display the grouped and sorted results
for length in sorted(grouped_words.keys()):
    print(f"\n{length} Letters Words:")
    for word in grouped_words[length]:
        print("-", word)
