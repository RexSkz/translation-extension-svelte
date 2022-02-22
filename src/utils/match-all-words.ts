import browser from 'webextension-polyfill';
import { Segment, useDefault } from 'segmentit';

import stopWords from './stop-words';

const segmentit = useDefault(new Segment());

const matchAllWords = (text: string) => {
  text = text.toLowerCase();
  const parts = segmentit.doSegment(text);

  return new Promise<Word[]>((resolve, reject) => {
    const listener = (msg: any) => {
      const map = new Map<Word, boolean>();
      const queried: Record<string, boolean> = {};

      if (msg.type === 'get-wordlist-response') {
        browser.runtime.onMessage.removeListener(listener);
        const wordlist = msg.wordlist;
        const words = wordlist.map(word => ({
          Project: word.Project,
          English: word.English.toLowerCase().split(/\s+/g),
          Chinese: word.Chinese.toLowerCase().split(/\s+/g),
          Notes: word.Notes,
        }));

        for (const part of parts) {
          if (stopWords[part.w] || queried[part.w]) {
            continue;
          }
          queried[part.w] = true;

          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word.English.includes(part.w)) {
              map.set(wordlist[i], true);
              continue;
            }
            if (word.Chinese.includes(part.w)) {
              map.set(wordlist[i], true);
              continue;
            }
          }
        }
        resolve(Array.from(map.keys()));
      } else {
        reject();
      }
    };
    browser.runtime.onMessage.addListener(listener);
    browser.runtime.sendMessage({ type: 'get-wordlist' });
  });
};

export default matchAllWords;
