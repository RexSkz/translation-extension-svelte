import matchSearchWord from './utils/match-search-word';
import wordList from './wordlist.csv';

import './content-script.less';

const highlightHandler = (e: MouseEvent) => {
  if (e.composedPath().some((el: HTMLElement) => el.classList && el.classList.contains('translate-extension-popup'))) {
    return;
  }

  const selection = document.getSelection();
  const text = selection.toString().trim();
  if (text) {
    if (!text) {
      return;
    }

    setTimeout(() => {
      const lower = text.toLowerCase();
      const searchResult = wordList.filter(word => matchSearchWord(lower, word)) || [];

      if (searchResult.length === 0) {
        return;
      }

      const expandDiv = document.createElement('div');
      expandDiv.classList.add('translate-extension-popup');
      expandDiv.style.top = `${e.pageY}px`;
      expandDiv.style.left = `${e.pageX}px`;

      expandDiv.innerHTML = [
        `<div class="translate-extension-popup-title">Translation of "${text.substring(0, 10)}${text.length > 10 ? '...' : ''}"</div>`,
        '<div class="translate-extension-popup-items">',
        searchResult.map(result => {
          const s = [
            `<div class="translate-extension-popup-item-text source">${result['模块']}</div>`,
            `<div class="translate-extension-popup-item-text"><b>EN</b> ${result['英文']}</div>`,
            `<div class="translate-extension-popup-item-text"><b>ZH</b> ${result['中文']}</div>`,
          ];
          if (result['备注']) {
            s.push(`<div class="translate-extension-popup-item-text">${result['备注']}</div>`);
          }
          return `<div class="translate-extension-popup-item">${s.join('')}</div>`;
        }).join(''),
        '</div>',
      ].join('');

      const collapse = (e: MouseEvent) => {
        if (e.composedPath().includes(expandDiv)) {
          return;
        }
        expandDiv.classList.add('exit');
        document.removeEventListener('click', collapse);
        setTimeout(() => {
          expandDiv.remove();
        }, 200);
      };

      const expand = () => {
        const expandDiv = document.querySelector('.translate-extension-popup');
        if (expandDiv) {
          expandDiv.classList.add('expand');
          expandDiv.removeEventListener('click', expand);
        }
      }

      document.body.appendChild(expandDiv);
      expandDiv.addEventListener('click', expand);
      document.body.addEventListener('click', collapse);
    }, 500);
  }
};

document.addEventListener('mouseup', highlightHandler);

export {};
