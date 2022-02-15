import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import esbuild from 'rollup-plugin-esbuild';
import css from 'rollup-plugin-css-only';
import less from 'rollup-plugin-less-modules';
import dsv from '@rollup/plugin-dsv';
import image from '@rollup/plugin-image';

import sveltePreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('yarn', ['sirv', 'public', '--dev', '--port', '3000'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

export default [
  {
    input: 'src/main.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/bundle.js'
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess({ sourceMap: !production }),
        compilerOptions: {
          accessors: true,
          dev: !production
        },
      }),
      css({ output: 'bundle.css' }),
      dsv(),
      image(),
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      commonjs(),
      esbuild({
        charset: 'utf8',
        sourceMap: !production,
        minify: production,
      }),
      !production && serve(),
      !production && livereload('public'),
      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  },
  {
    input: 'src/background.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      file: 'public/build/background.js',
      globals: {
        'webextension-polyfill': 'browser',
      },
    },
    plugins: [
      resolve({ preferBuiltins: false }),
      commonjs(),
      esbuild({
        charset: 'utf8',
        sourceMap: !production,
        minify: production,
      }),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/content-script.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      file: 'public/build/content-script.js',
      globals: {
        'webextension-polyfill': 'browser',
      },
    },
    plugins: [
      less({ output: 'public/build/content-script.css' }),
      dsv(),
      image(),
      resolve({ preferBuiltins: false }),
      commonjs(),
      esbuild({
        charset: 'utf8',
        sourceMap: !production,
        minify: production,
      }),
    ],
    watch: {
      clearScreen: false,
    },
  },
];
