const posMap = {
  adj: 'adjective, 形容词',
  adv: 'adverb, 副词',
  art: 'article, 冠词',
  conj: 'conjunction, 连词',
  interj: 'interjection, 感叹词',
  n: 'noun, 名词',
  num: 'numeral, 数词',
  prep: 'preposition, 介词',
  pron: 'pronoun, 代词',
  v: 'verb, 动词',
};

const getPosText = (pos: string) => {
  const fullText = posMap[pos.trim().replace('.', '').toLowerCase()];
  return fullText ? `${pos} (${fullText})` : 'Unknown parts of speech';
};

export default getPosText;
