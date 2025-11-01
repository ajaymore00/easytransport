
export default {
  basePath: 'https://ajaymore00.github.io/easytransport',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
