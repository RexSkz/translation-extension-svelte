import matchAllWords from './utils/match-all-words';

import icon from '../public/icons/48.png';

import './content-script.less';

const ellipsis = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substr(0, maxLength)}...`;
};

const createPopup = (e: MouseEvent, searchResult: Word[], text: string) => {
  const expandDiv = document.createElement('div');
  expandDiv.classList.add('translate-extension-popup');
  expandDiv.style.top = `${e.pageY}px`;
  expandDiv.style.left = `${e.pageX}px`;

  expandDiv.innerHTML = [
    `<img src="${icon}" width="24" class="translate-extension-popup-thumbnail"></img>`,
    `<div class="translate-extension-popup-title">Words in "${ellipsis(text, 10)}"</div>`,
    '<div class="translate-extension-popup-items">',
    searchResult.map(result => {
      const s = [
        `<div class="translate-extension-popup-item-text source">${result.src}</div>`,
        `<div class="translate-extension-popup-item-text"><b>EN</b> ${result.en}</div>`,
        `<div class="translate-extension-popup-item-text"><b>ZH</b> ${result.zh}</div>`,
      ];
      if (result['备注']) {
        s.push(`<div class="translate-extension-popup-item-text">${result.desc}</div>`);
      }
      return `<div class="translate-extension-popup-item">${s.join('')}</div>`;
    }).join(''),
    '</div>',
  ].join('');

  document.body.appendChild(expandDiv);

  return expandDiv;
};

const highlightHandler = (e: MouseEvent) => {
  if (e.composedPath().some((el: HTMLElement) => el.classList && el.classList.contains('translate-extension-popup'))) {
    return;
  }

  const selection = document.getSelection();
  const text = selection.toString().trim();
  if (!text) {
    return;
  }

  const openPopupThumb = async () => {
    const searchResult = await matchAllWords(text);
    if (!searchResult.length) {
      return;
    }

    const expandDiv = createPopup(e, searchResult, text);

    const close = (e: MouseEvent) => {
      if (e.composedPath().includes(expandDiv)) {
        return;
      }
      expandDiv.classList.add('exit');
      document.removeEventListener('click', close);
      setTimeout(() => expandDiv.remove(), 200);
    };

    const expand = function () {
      this.classList.add('expand');
      this.removeEventListener('click', expand);
    };

    expandDiv.addEventListener('click', expand);
    document.body.addEventListener('click', close);
  };

  setTimeout(openPopupThumb, 300);
};

document.addEventListener('mouseup', highlightHandler);

export {};
