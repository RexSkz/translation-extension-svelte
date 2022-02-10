const splitRe = /[`\-=\[\]\\;',.\/~!@#$%^&*()_+{}|:"<>?]+?/g;

const matchSearchWord = (search: string, word: Word) => {
  const searchArr = search.toLowerCase().split(splitRe);

  if (searchArr.every(part => (word['中文'] || '').toLowerCase().includes(part))) {
    return true;
  }

  const englishArr = (word['英文'] || '').toLowerCase().split(splitRe);
  if (searchArr.every(part => englishArr.includes(part))) {
    return true;
  }

  return false;
};

export default matchSearchWord;
