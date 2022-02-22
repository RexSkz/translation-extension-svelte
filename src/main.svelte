<script lang="ts">
import browser from 'webextension-polyfill';
import Button from './components/button/index.svelte';
import Input from './components/input/index.svelte';
import Tag from './components/tag/index.svelte';

import matchSearchWord from './utils/match-search-word';

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
  </form>
  {#if searchResult.length}
    <div>
      <h3 class="search-result-title">Search Result</h3>
      <ul class="word-list">
        {#each searchResult as word}
          <li>
            <Tag color="pink" style="position: absolute; top: 16px; right: 16px;">
              Source: {word.Project}
            </Tag>
            <div class="text">
              <span class="lang">
                <Tag color="gray" style="font-weight: 500">EN</Tag>
              </span>
              {word.English}
            </div>
            <div class="text">
              <span class="lang">
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
@import './components/_styles/base.less';

:global {
  html, body {
    position: relative;
    background: @color-gray-background;
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
  font-weight: 300;
}
</style>
