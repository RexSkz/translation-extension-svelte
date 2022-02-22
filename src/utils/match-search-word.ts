const splitRe = /[`\-=\[\]\\;',.\/~!@#$%^&*()_+{}|:"<>?]+?/g;

const matchSearchWord = (search: string, word: Word) => {
  const searchArr = search.toLowerCase().split(splitRe);

  if (searchArr.every(part => (word.Chinese || '').toLowerCase().includes(part))) {
    return true;
  }

  const englishArr = (word.English || '').toLowerCase().split(splitRe);
  if (searchArr.every(part => englishArr.includes(part))) {
    return true;
  }

  return false;
};

export default matchSearchWord;
