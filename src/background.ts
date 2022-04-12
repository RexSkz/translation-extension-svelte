import browser from 'webextension-polyfill';

import { csvParse } from './utils/d3-dsv';

const URL_TEMPLATE = 'https://docs.google.com/spreadsheets/u/USER_INDEX/d/e/2PACX-1vQYRc0n81kQfYLjCJz-pE0QM22aFNwtVzpgdp87iMY-voVxmB7h9lCEvCV1OsGd5nrk1H6TojiVryJG/pub?output=csv';
const MIN_UPDATE_INTERVAL = 3600;
const MAX_GOOGLE_ACCOUNT_TRIES = 5;

let wordlist: Word[] = [];
let lastUpdateTime = 0;

const updateWordList = (force = false) => {
  const now = Date.now() / 1000 | 0;
  if (!force && now - lastUpdateTime < MIN_UPDATE_INTERVAL) {
    return;
  }
  lastUpdateTime = now;
  const promises: Array<Promise<Word[]>> = [];
  for (let i = 0; i < MAX_GOOGLE_ACCOUNT_TRIES; i++) {
    const url = URL_TEMPLATE.replace('USER_INDEX', String(i));
    promises.push(
      fetch(url, { credentials: 'include' })
        .then(response => response.status === 200 ? response.text() : Promise.reject())
        .then(text => csvParse(text))
        .catch(() => []),
    );
  }
  return Promise.all(promises).then((wordsSet: Word[][]) => {
    for (const words of wordsSet) {
      if (words.length) {
        wordlist = words;
        console.log('Word list loaded', wordlist);
      }
    }
    browser.storage.local.set({ wordlist, lastUpdateTime });
  });
};

(async () => {
  const store = await browser.storage.local.get();
  if (store.wordlist?.length) {
    wordlist = store.wordlist;
    lastUpdateTime = store.lastUpdateTime;
    browser.runtime.sendMessage({
      type: 'get-wordlist-response',
      wordlist,
      lastUpdateTime,
    });
  }
})();

updateWordList();

browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === 'get-wordlist') {
    if (message.force) {
      // this will force fetch the newest result
      await updateWordList(true);
    } else {
      // this update will not affect the result, just for caching
      updateWordList();
    }
    if (sender.tab) {
      browser.tabs.sendMessage(sender.tab.id, {
        type: 'get-wordlist-response',
        wordlist,
        lastUpdateTime,
      });
    } else {
      browser.runtime.sendMessage({
        type: 'get-wordlist-response',
        wordlist,
        lastUpdateTime,
      });
    }
  }
  if (message.type === 'google-translate') {
    fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      body: JSON.stringify({
        q: message.text,
        target: 'zh',
      }),
    }).then(response => {
      return response.status === 200 ? response.json() : Promise.reject();
    }).then(({ data }) => {
      browser.tabs.sendMessage(sender.tab.id, {
        type: 'google-translate-response',
        result: data.translations[0].translatedText,
      });
    }).catch(err => {
      browser.tabs.sendMessage(sender.tab.id, {
        type: 'google-translate-response',
        result: `Error: ${err}`,
      });
    });
  }
});
