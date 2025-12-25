import pugPlugin from '@prettier/plugin-pug'

/** @type {import('prettier').Config} */
export default {
  plugins: [pugPlugin],
  htmlWhitespaceSensitivity: 'ignore',
  pugFramework: 'vue',
  pugSingleFileComponentIndentation: false,
}


