<script lang="ts">
import Button from './components/button/index.svelte';
import Input from './components/input/index.svelte';
import Tag from './components/tag/index.svelte';

import matchSearchWord from './utils/match-search-word';

import wordList from './wordlist.csv';

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
  searchResult = wordList.filter(word => matchSearchWord(lower, word)) || [];
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
              Source: {word['模块']}
            </Tag>
            <div class="text">
              <span class="lang">
                <Tag color="gray" style="font-weight: 500">EN</Tag>
              </span>
              {word['英文']}
            </div>
            <div class="text">
              <span class="lang">
                <Tag color="gray" style="font-weight: 500">CN</Tag>
              </span>
              {word['中文']}
            </div>
            {#if word['备注']}
              <h3 class="remark-title">Remark</h3>
              <div>{word['备注']}</div>
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
    width: 100%;
    height: 100%;
    background: @color-gray-background;
  }

  body {
    color: #333;
    margin: 0;
    padding: 16px;
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

  li {
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    margin: 16px 0;
    padding: 16px;
    font-size: 14px;
    line-height: 1.5;
    position: relative;

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


    .remark-title {
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
  opacity: 0.2;
  font-size: 1.5em;
  font-weight: 300;
}
</style>
