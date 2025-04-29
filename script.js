const searchInput = document.getElementById('search');
const nameDisplay = document.getElementById('name');
const wikiTitle = document.getElementById('wiki-title');
const wikiText = document.getElementById('wiki-text');
const datamuseTitle = document.getElementById('datamuse-title');
const datamuseText = document.getElementById('datamuse-text');
const datamuseTranslation = document.getElementById('datamuse-translation');
const unsplashImg = document.getElementById('unsplash-title');

searchInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (!query) return;

    nameDisplay.textContent = `Search: ${query}`;

    fetchWikipedia(query);
    fetchDatamuse(query);
    fetchTranslation(query);
    fetchPixabay(query);
  }
});

async function fetchWikipedia(query) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    wikiTitle.textContent = data.title || query;
    wikiText.textContent = data.extract || 'No summary available.';

    // If Wikipedia provides a thumbnail, use it
    if (data.thumbnail?.source) {
      unsplashImg.src = data.thumbnail.source;
      unsplashImg.alt = query;
    }
  } catch (error) {
    wikiTitle.textContent = 'Error';
    wikiText.textContent = 'Failed to fetch Wikipedia data.';
  }
}

async function fetchDatamuse(query) {
  const url = `https://api.datamuse.com/words?ml=${encodeURIComponent(query)}&max=1`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.length > 0) {
      datamuseTitle.textContent = data[0].word;
      datamuseText.textContent = `Related to: ${query}`;
    } else {
      datamuseTitle.textContent = 'No related word found.';
      datamuseText.textContent = '';
    }
  } catch (error) {
    datamuseTitle.textContent = 'Error';
    datamuseText.textContent = 'Failed to fetch Datamuse data.';
  }
}

async function fetchTranslation(text) {
  const url = `https://translate.astian.org/translate`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: "en",
        format: "text"
      })
    });

    if (!res.ok) throw new Error("Bad response from translator");

    const data = await res.json();
    datamuseTranslation.textContent = `Translated: ${data.translatedText}`;
  } catch (error) {
    datamuseTranslation.textContent = 'Translation failed.';
  }
}

async function fetchPixabay(query) {
  const url = `https://pixabay.com/api/?key=39096995-babcde53a7b6e7054ab3b3c53&q=${encodeURIComponent(query)}&image_type=photo&per_page=1&safesearch=true`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      unsplashImg.src = data.hits[0].webformatURL;
      unsplashImg.alt = query;
    }
  } catch (error) {
    console.error('Pixabay fetch error', error);
  }
}
