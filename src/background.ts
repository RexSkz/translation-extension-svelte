import browser from 'webextension-polyfill';

import { csvParse } from './utils/d3-dsv';

const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQYRc0n81kQfYLjCJz-pE0QM22aFNwtVzpgdp87iMY-voVxmB7h9lCEvCV1OsGd5nrk1H6TojiVryJG/pub?output=csv';
const wordlist: Word[] = [];

fetch(url, { credentials: 'include' }).then(response => response.text()).then(text => {
  const parsed: Word[] = csvParse(text);
  wordlist.push(...parsed);
  console.log(wordlist);
}).catch(error => {
  console.error(error);
});

browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'get-wordlist') {
    if (sender.tab) {
      browser.tabs.sendMessage(sender.tab.id, {
        type: 'get-wordlist-response',
        wordlist,
      });
    } else {
      browser.runtime.sendMessage({
        type: 'get-wordlist-response',
        wordlist,
      });
    }
  }
});
