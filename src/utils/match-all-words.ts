import { Segment, useDefault } from 'segmentit';

import wordList from '../wordlist.csv';
import stopWords from './stop-words';

const segmentit = useDefault(new Segment());

const matchAllWords = (text: string) => {
  text = text.toLowerCase();
  const parts = segmentit.doSegment(text);

  const words = wordList.map(word => ({
    src: word.src,
    en: word.en.toLowerCase().split(/\s+/g),
    zh: word.zh.toLowerCase().split(/\s+/g),
    desc: word.desc,
  }))

  const map = new Map<Word, boolean>();
  const queried: Record<string, boolean> = {};

  for (const part of parts) {
    if (stopWords[part.w] || queried[part.w]) {
      continue;
    }
    queried[part.w] = true;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.en.includes(part.w)) {
        map.set(wordList[i], true);
        continue;
      }
      if (word.zh.includes(part.w)) {
        map.set(wordList[i], true);
        continue;
      }
    }
  }

  return Array.from(map.keys());
};

export default matchAllWords;
