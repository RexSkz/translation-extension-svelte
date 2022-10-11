import browser from 'webextension-polyfill';

import matchAllWords from './utils/match-all-words';
import getPosText from './utils/get-pos-text';

import icon from '../public/icons/48.png';

import './content-script.less';

const ellipsis = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength)}...`;
};

const createPopup = (e: MouseEvent, searchResult: Word[], text: string) => {
  if (document.querySelector('.translate-extension-popup')) {
    return;
  }

  const expandDiv = document.createElement('div');
  expandDiv.classList.add('translate-extension-popup');
  expandDiv.style.top = `${e.pageY}px`;
  expandDiv.style.left = `${e.pageX}px`;

  const gtId = (Math.random() * 1e9 | 0).toString(16);
  const selector = `translate-extension-popup-google-translate-${gtId}`;

  expandDiv.innerHTML = [
    `<img src="${icon}" width="24" class="translate-extension-popup-thumbnail"></img>`,
    '<div class="translate-extension-popup-title">',
      `Words in "${ellipsis(text, 10)}"`,
      '<div class="translate-extension-popup-feedback-link">',
        '<a href="https://forms.gle/s6EGjqUx7jaUU7Cx8" target="_blank">Feedback</a>',
      '</div>',
    '</div>',
    '<div class="translate-extension-popup-items">',
      searchResult.map(result => {
        const s = [
          result.Source
            ? `<div class="translate-extension-popup-item-text source">${result.Source}</div>`
            : '',
          result['Parts of speech']
            ? `<div class="translate-extension-popup-item-text parts-of-speech"><b>POS</b> ${getPosText(result['Parts of speech'])}</div>`
            : '',
          `<div class="translate-extension-popup-item-text"><b>EN</b> ${result.English}</div>`,
          `<div class="translate-extension-popup-item-text"><b>ZH</b> ${result.Chinese}</div>`,
        ];
        if (result.Notes) {
          s.push(`
            <div class="translate-extension-popup-item-title">Notes</div>
            <div class="translate-extension-popup-item-text">${result.Notes}</div>
          `);
        }
        if (result.Example) {
          s.push(`
            <div class="translate-extension-popup-item-title">Example</div>
            <div class="translate-extension-popup-item-text">${result.Example}</div>
          `);
        }
        return `<div class="translate-extension-popup-item">${s.join('')}</div>`;
      }).join(''),
    '</div>',
    '<div class="translate-extension-popup-google-translate">',
      '<b>Google translation: </b>',
      text.length > 100 ? (
        `<a id="translate-extension-popup-google-translate-${gtId}" href="https://translate.google.cn/?sl=auto&tl=zh-CN&text=${encodeURI(text)}&op=translate" target="_blank">[text too long, click to open in new tab]</a>`
      ) : (
        `<span id="translate-extension-popup-google-translate-${gtId}">[click to translate]</span>`
      ),
    '</div>',
  ].join('');

  document.body.appendChild(expandDiv);

  const translateListener = (message: any) => {
    if (message.type === 'google-translate-response') {
      const dom = document.getElementById(selector);
      if (dom) {
        dom.innerText = message.result;
      }
    }
  };
  browser.runtime.onMessage.addListener(translateListener);

  const dom = document.getElementById(selector);
  dom.onclick = () => {
    if (text.length <= 100) {
      dom.innerText = '[translating...]';
      browser.runtime.sendMessage({ type: 'google-translate', text, id: gtId });
    }
  };

  return expandDiv;
};

const highlightHandler = (e: MouseEvent) => {
  if (e.composedPath().some((el: HTMLElement) => el.classList && el.classList.contains('translate-extension-popup'))) {
    return;
  }

  let previousExpandDiv: HTMLDivElement | null = null;

  const openPopupThumb = async () => {
    const store = await browser.storage.local.get();
    if (store.options?.translateSelectText === false) {
      return;
    }

    const selection = document.getSelection();
    const text = selection.toString().trim();
    if (!text) {
      return;
    }

    const searchResult = await matchAllWords(text);
    if (!searchResult.length) {
      return;
    }

    if (previousExpandDiv) {
      previousExpandDiv.remove();
    }

    const expandDiv = createPopup(e, searchResult, text);
    if (!expandDiv) {
      return;
    }
    previousExpandDiv = expandDiv;

    const close = (e: MouseEvent) => {
      if (e.composedPath().includes(expandDiv)) {
        return;
      }
      expandDiv.classList.add('exit');
      document.removeEventListener('click', close);
      setTimeout(() => expandDiv.remove(), 100);
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
