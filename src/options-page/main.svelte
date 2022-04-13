<script lang="ts">
import { onMount } from 'svelte';

import browser from 'webextension-polyfill';

import Button from '../components/button/index.svelte';

let translateSelectText = true;
let updatingWordList = false;
let wordlist: Word[] = [];
let lastUpdateTime = 0;

let checkingForUpdates = true;
let currentVersion = browser.runtime.getManifest().version;
let latestVersion = {
  version: '',
  zipball_url: '',
  body: '',
};

const getWordList = (force = false) => {
  browser.runtime.sendMessage({ type: 'get-wordlist', force });
}

const saveChanges = () => {
  browser.storage.local.set({
    options: {
      translateSelectText,
    },
  }).then(() => {
    alert('Options saved!');
  });
};

const updateWordList = () => {
  updatingWordList = true;
  getWordList(true);
};

const checkForUpdates = () => {
  checkingForUpdates = true;
  fetch('https://api.github.com/repos/RexSkz/translation-extension-svelte/releases/latest').then(res => {
    if (res.ok) {
      res.json().then(data => {
        latestVersion = {
          version: '',
          zipball_url: '',
          body: data.body,
        };
        if (latestVersion.version !== currentVersion) {
          latestVersion.version = data.tag_name.replace(/^v/, '');
          latestVersion.zipball_url = data.assets[0]?.browser_download_url;
          browser.storage.local.set({ currentVersion, latestVersion: latestVersion.version });
        }
      });
    }
  }).finally(() => {
    checkingForUpdates = false;
  });
};

onMount(async () => {
  const listener = (msg: any) => {
    if (msg.type === 'get-wordlist-response') {
      wordlist = msg.wordlist;
      lastUpdateTime = msg.lastUpdateTime;
      updatingWordList = false;
    }
  };
  browser.runtime.onMessage.addListener(listener);

  const storage = await browser.storage.local.get();
  translateSelectText = storage.options?.translateSelectText ?? true;

  getWordList();
  checkForUpdates();
});
</script>

<header>
  <h1>Translate Extension</h1>
</header>
<main>
  <h2>Options</h2>
  <form name="optionForm" on:submit|preventDefault>
    <label for="translate-select-text">
      <span class="form-item-label">Translate selected text:</span>
      <span>
        <label class="radio-label" for="translate-select-text-yes">
          <input type="radio" id="translate-select-text-yes" bind:group={translateSelectText} value={true} /> Yes
        </label>
        <label class="radio-label" for="translate-select-text-no">
          <input type="radio" id="translate-select-text-no" bind:group={translateSelectText} value={false} /> No
        </label>
      </span>
    </label>
    <label for="submit-button">
      <Button type="primary" onClick={saveChanges}>Save</Button>
    </label>
  </form>
  <hr />
  <h2>Word list</h2>
  {#if updatingWordList}
    <p>Updating word list...</p>
  {:else}
    <p>There are <abbr>{wordlist.length}</abbr> word(s) in the word list, last updated at <abbr>{Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'medium' }).format(lastUpdateTime * 1000)}</abbr>.</p>
    <Button onClick={updateWordList}>Update wordlist</Button>
  {/if}
  <hr />
  <h2>Updates</h2>
  {#if checkingForUpdates}
    <p>Checking for updates...</p>
  {:else if latestVersion.version !== currentVersion}
    <p>Current version: <abbr>{currentVersion}</abbr></p>
    <p>Latest version: <abbr>{latestVersion.version}</abbr>, an update is available!</p>
    <Button onClick={() => window.open(latestVersion.zipball_url)}>Download the latest version</Button>
    <p><b>Release notes for {latestVersion.version}:</b></p>
    <p class="release-notes">{latestVersion.body}</p>
  {:else}
    <p>You are running the latest version <abbr>{currentVersion}</abbr>.</p>
    <Button onClick={checkForUpdates}>Check for updates</Button>
  {/if}
  <hr />
  <h2>Feedback</h2>
  <p>If you have any questions or suggestions, do not hesitate to <a href="https://forms.gle/s6EGjqUx7jaUU7Cx8" target="_blank">give us your feedback</a>!</p>
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
    font-size: 14px;
  }

  a {
    color: rgb(0,100,200);
    text-decoration: underline;
  }

  a:visited {
    color: rgb(0,80,160);
  }

  abbr {
    border-bottom: 1px dotted;
  }
}

header {
  background: @color-primary;
  color: @color-white;
  padding: 16px;

  h1 {
    font-size: 18px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }
}

main {
  background: #fff;
  border-radius: 4px;
  box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.05);
  padding: 16px;
  max-width: 960px;
  margin: 16px auto;

  h2 {
    font-size: 18px;
    line-height: 16px;
    margin: 0 0 1em;
    padding: 0 0 0 8px;;
    border-left: 4px solid @color-primary;
  }

  hr {
    border: none;
    border-top: 1px solid @color-gray-divider;
    margin: 1.5em 0;
  }

  form > label {
    display: flex;
    margin-bottom: 0.5em;
    line-height: 32px;

    &:last-child {
      margin-bottom: 0;
    }

    .form-item-label {
      display: inline-block;
      font-weight: bold;
      width: 12em;
    }

    .radio-label {
      margin-left: 0.5em;
      margin-right: 4px;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  label > * {
    vertical-align: middle;
  }

  .release-notes {
    background: @color-gray-maxlight;
    border-left: 2px solid @color-gray-divider;
    padding: 8px;
    white-space: pre-wrap;
  }
}
</style>
