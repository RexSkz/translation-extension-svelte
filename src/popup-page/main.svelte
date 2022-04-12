<script lang="ts">
import browser from 'webextension-polyfill';

import Button from '../components/button/index.svelte';
import Input from '../components/input/index.svelte';
import Tag from '../components/tag/index.svelte';

import matchSearchWord from '../utils/match-search-word';
import getPosText from '../utils/get-pos-text';
import { onMount } from 'svelte';

let hasBadge = false;
let input = '';
let searchWord = '';
let searchResult: Word[] = [];

const onInputChange = (e: Event) => {
  input = (e.target as HTMLInputElement).value;
};

const onSearchButtonClick = () => {
  searchWord = input.trim();
  if (!searchWord) {
    return;
  }
  const lower = searchWord.toLowerCase();
  const listener = (msg: any) => {
    if (msg.type === 'get-wordlist-response') {
      browser.runtime.onMessage.removeListener(listener);
      const wordlist = msg.wordlist;
      searchResult = wordlist.filter((word: Word) => matchSearchWord(lower, word));
    }
  };
  browser.runtime.onMessage.addListener(listener);
  browser.runtime.sendMessage({ type: 'get-wordlist' });
};

const openConfigPage = () => {
  if (browser.runtime.openOptionsPage) {
    browser.runtime.openOptionsPage();
  } else {
    window.open(browser.runtime.getURL('options.html'));
  }
}

onMount(async () => {
  const store = await browser.storage.local.get();
  const { currentVersion = '', latestVersion = '' } = store;
  if (currentVersion !== latestVersion) {
    hasBadge = true;
  }
})
</script>

<main>
  <form class="search-area" on:submit|preventDefault>
    <Input
      value={input}
      onChange={onInputChange}
      placeholder="Input a word to search..."
      style="margin-right: 8px; flex-grow: 1;"
    />
    <Button
      type="primary"
      htmlType="submit"
      onClick={onSearchButtonClick}
    >
      Search
    </Button>
    <Button className="config-button" onClick={openConfigPage}>
      <svg viewBox="0 0 478.703 478.703" style="width: 16px; height: 16px">
        <path d="M454.2,189.101l-33.6-5.7c-3.5-11.3-8-22.2-13.5-32.6l19.8-27.7c8.4-11.8,7.1-27.9-3.2-38.1l-29.8-29.8c-5.6-5.6-13-8.7-20.9-8.7c-6.2,0-12.1,1.9-17.1,5.5l-27.8,19.8c-10.8-5.7-22.1-10.4-33.8-13.9l-5.6-33.2c-2.4-14.3-14.7-24.7-29.2-24.7h-42.1c-14.5,0-26.8,10.4-29.2,24.7l-5.8,34c-11.2,3.5-22.1,8.1-32.5,13.7l-27.5-19.8c-5-3.6-11-5.5-17.2-5.5c-7.9,0-15.4,3.1-20.9,8.7l-29.9,29.8c-10.2,10.2-11.6,26.3-3.2,38.1l20,28.1c-5.5,10.5-9.9,21.4-13.3,32.7l-33.2,5.6c-14.3,2.4-24.7,14.7-24.7,29.2v42.1c0,14.5,10.4,26.8,24.7,29.2l34,5.8c3.5,11.2,8.1,22.1,13.7,32.5l-19.7,27.4c-8.4,11.8-7.1,27.9,3.2,38.1l29.8,29.8c5.6,5.6,13,8.7,20.9,8.7c6.2,0,12.1-1.9,17.1-5.5l28.1-20c10.1,5.3,20.7,9.6,31.6,13l5.6,33.6c2.4,14.3,14.7,24.7,29.2,24.7h42.2c14.5,0,26.8-10.4,29.2-24.7l5.7-33.6c11.3-3.5,22.2-8,32.6-13.5l27.7,19.8c5,3.6,11,5.5,17.2,5.5l0,0c7.9,0,15.3-3.1,20.9-8.7l29.8-29.8c10.2-10.2,11.6-26.3,3.2-38.1l-19.8-27.8c5.5-10.5,10.1-21.4,13.5-32.6l33.6-5.6c14.3-2.4,24.7-14.7,24.7-29.2v-42.1C478.9,203.801,468.5,191.501,454.2,189.101z M451.9,260.401c0,1.3-0.9,2.4-2.2,2.6l-42,7c-5.3,0.9-9.5,4.8-10.8,9.9c-3.8,14.7-9.6,28.8-17.4,41.9c-2.7,4.6-2.5,10.3,0.6,14.7l24.7,34.8c0.7,1,0.6,2.5-0.3,3.4l-29.8,29.8c-0.7,0.7-1.4,0.8-1.9,0.8c-0.6,0-1.1-0.2-1.5-0.5l-34.7-24.7c-4.3-3.1-10.1-3.3-14.7-0.6c-13.1,7.8-27.2,13.6-41.9,17.4c-5.2,1.3-9.1,5.6-9.9,10.8l-7.1,42c-0.2,1.3-1.3,2.2-2.6,2.2h-42.1c-1.3,0-2.4-0.9-2.6-2.2l-7-42c-0.9-5.3-4.8-9.5-9.9-10.8c-14.3-3.7-28.1-9.4-41-16.8c-2.1-1.2-4.5-1.8-6.8-1.8c-2.7,0-5.5,0.8-7.8,2.5l-35,24.9c-0.5,0.3-1,0.5-1.5,0.5c-0.4,0-1.2-0.1-1.9-0.8l-29.8-29.8c-0.9-0.9-1-2.3-0.3-3.4l24.6-34.5c3.1-4.4,3.3-10.2,0.6-14.8c-7.8-13-13.8-27.1-17.6-41.8c-1.4-5.1-5.6-9-10.8-9.9l-42.3-7.2c-1.3-0.2-2.2-1.3-2.2-2.6v-42.1c0-1.3,0.9-2.4,2.2-2.6l41.7-7c5.3-0.9,9.6-4.8,10.9-10c3.7-14.7,9.4-28.9,17.1-42c2.7-4.6,2.4-10.3-0.7-14.6l-24.9-35c-0.7-1-0.6-2.5,0.3-3.4l29.8-29.8c0.7-0.7,1.4-0.8,1.9-0.8c0.6,0,1.1,0.2,1.5,0.5l34.5,24.6c4.4,3.1,10.2,3.3,14.8,0.6c13-7.8,27.1-13.8,41.8-17.6c5.1-1.4,9-5.6,9.9-10.8l7.2-42.3c0.2-1.3,1.3-2.2,2.6-2.2h42.1c1.3,0,2.4,0.9,2.6,2.2l7,41.7c0.9,5.3,4.8,9.6,10,10.9c15.1,3.8,29.5,9.7,42.9,17.6c4.6,2.7,10.3,2.5,14.7-0.6l34.5-24.8c0.5-0.3,1-0.5,1.5-0.5c0.4,0,1.2,0.1,1.9,0.8l29.8,29.8c0.9,0.9,1,2.3,0.3,3.4l-24.7,34.7c-3.1,4.3-3.3,10.1-0.6,14.7c7.8,13.1,13.6,27.2,17.4,41.9c1.3,5.2,5.6,9.1,10.8,9.9l42,7.1c1.3,0.2,2.2,1.3,2.2,2.6v42.1H451.9z"/>
        <path d="M239.4,136.001c-57,0-103.3,46.3-103.3,103.3s46.3,103.3,103.3,103.3s103.3-46.3,103.3-103.3S296.4,136.001,239.4,136.001 z M239.4,315.601c-42.1,0-76.3-34.2-76.3-76.3s34.2-76.3,76.3-76.3s76.3,34.2,76.3,76.3S281.5,315.601,239.4,315.601z"/>
      </svg>
      {#if hasBadge}
        <span class="badge" />
      {/if}
    </Button>
  </form>
  {#if searchResult.length}
    <div>
      <h3 class="search-result-title">
        Search Result
        <span class="feedback-link">
          <a href="https://forms.gle/s6EGjqUx7jaUU7Cx8" target="_blank">Feedback</a>
        </span>
      </h3>
      <ul class="word-list">
        {#each searchResult as word}
          <li>
            <Tag color="pink" style="position: absolute; top: 16px; right: 16px;">
              Source: {word.Project}
            </Tag>
            <div class="text parts-of-speech">
              <span class="lang" title="Parts of speech">
                <Tag color="gray" style="font-weight: 500">POS</Tag>
              </span>
              {getPosText(word['Parts of speech'])}
            </div>
            <div class="text">
              <span class="lang" title="English">
                <Tag color="gray" style="font-weight: 500">EN</Tag>
              </span>
              {word.English}
            </div>
            <div class="text">
              <span class="lang" title="Simplified Chinese">
                <Tag color="gray" style="font-weight: 500">ZH</Tag>
              </span>
              {word.Chinese}
            </div>
            {#if word.Notes}
              <h3 class="notes-title">Notes</h3>
              <div>{word.Notes}</div>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {:else}
    <div>
      <h3 class="search-result-title">
        Search Result
        <span class="feedback-link">
          <a href="https://forms.gle/s6EGjqUx7jaUU7Cx8" target="_blank">Feedback</a>
        </span>
      </h3>
      <p class="search-result-empty">
        {#if searchWord}
          No result found for "{searchWord}".
        {:else}
          Input a word and click "Search".
        {/if}
      </p>
    </div>
  {/if}
</main>

<style lang="less">
@import '../components/_styles/base.less';

:global {
  html, body {
    position: relative;
    background: @color-gray-maxlight;
  }

  body {
    color: #333;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }

  a {
    color: rgb(0,100,200);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  a:visited {
    color: rgb(0,80,160);
  }

  label {
    display: block;
  }

  .config-button {
    background: none !important;
    border: none !important;
    padding: 0 8px !important;

    .badge {
      display: inline-block;
      position: absolute;
      top: 4px;
      right: 4px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: @color-danger;
    }
  }
}

main {
  width: 480px;
  margin: 16px;
}

.search-area {
  display: flex;
}

.search-result-title {
  border-left: 4px solid @color-primary;
  line-height: 14px;
  margin: 24px 0;
  padding-left: 8px;
  font-size: 16px;

  & > * {
    vertical-align: middle;
  }

  .feedback-link {
    color: @color-link;
    float: right;
    font-size: 14px;

    &:hover {
      color: @color-link-hover;
    }
  }
}

.word-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 360px;
  overflow-y: auto;

  li {
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    margin: 16px 0;
    padding: 16px;
    font-size: 14px;
    line-height: 1.5;
    position: relative;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .text {
      margin-bottom: 4px;

      & > * {
        vertical-align: top;
      }

      .lang {
        font-family: 'source code variable', consolas, menlo, monaco, 'courier new', 'ubuntu mono', 'pingfang sc', '微软雅黑', '微軟正黑體', 'wenquanyi micro hei', monospace !important;
        margin-right: 4px;
      }
    }

    .notes-title {
      font-size: 14px;
      line-height: 14px;
      margin: 12px 0 8px;
    }
  }
}

.search-result-empty {
  border: 1px dashed;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  opacity: 0.5;
  font-size: 1.5em;
}
</style>
