
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://ajaymore00.github.io/easytransport/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/easytransport/auth/login",
    "route": "/easytransport"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4RIKVQ45.js"
    ],
    "redirectTo": "/easytransport/auth/login",
    "route": "/easytransport/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4RIKVQ45.js",
      "chunk-NIT62JGP.js",
      "chunk-C6B45HKW.js"
    ],
    "route": "/easytransport/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4RIKVQ45.js",
      "chunk-QWOHBPND.js",
      "chunk-C6B45HKW.js"
    ],
    "route": "/easytransport/auth/signup"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4RIKVQ45.js",
      "chunk-XYS4UE7J.js",
      "chunk-C6B45HKW.js"
    ],
    "route": "/easytransport/auth/forgot-password"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7OSM7JS5.js",
      "chunk-MDSJRCDV.js"
    ],
    "route": "/easytransport/transport"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7OSM7JS5.js",
      "chunk-MDSJRCDV.js"
    ],
    "route": "/easytransport/transport/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7OSM7JS5.js",
      "chunk-MDSJRCDV.js"
    ],
    "route": "/easytransport/transport/vehicles"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7OSM7JS5.js",
      "chunk-MDSJRCDV.js"
    ],
    "route": "/easytransport/transport/drivers"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7OSM7JS5.js",
      "chunk-MDSJRCDV.js"
    ],
    "route": "/easytransport/transport/expenses"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7OSM7JS5.js",
      "chunk-MDSJRCDV.js"
    ],
    "route": "/easytransport/transport/routes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7OSM7JS5.js",
      "chunk-MDSJRCDV.js"
    ],
    "route": "/easytransport/transport/tracking"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7OSM7JS5.js",
      "chunk-MDSJRCDV.js"
    ],
    "redirectTo": "/easytransport/transport/dashboard",
    "route": "/easytransport/transport/**"
  },
  {
    "renderMode": 2,
    "redirectTo": "/easytransport/auth/login",
    "route": "/easytransport/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 2422, hash: 'fc9e81542cadd7f9b4aae99ac4f37a0af67df0ed14d99b2f389ad7eef0bd4c7b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1201, hash: 'f6c8c1597c14b3d59cee6a5b49036e42cd98ada5e234a6efaa5de4b4d4e50993', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 11837, hash: 'aebf909d2d6b19b4469f9f3448248b9cfb557495617d52aee6674241bee10fb2', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'auth/signup/index.html': {size: 12100, hash: '7a88831934491a07e203d09cf14cafc17675454a380742df6e41d617d6c937e7', text: () => import('./assets-chunks/auth_signup_index_html.mjs').then(m => m.default)},
    'transport/index.html': {size: 2979, hash: '6437393214f6c10ca270167bc87f0bd95d148b2c49b60784092c45b112d7337c', text: () => import('./assets-chunks/transport_index_html.mjs').then(m => m.default)},
    'transport/vehicles/index.html': {size: 2979, hash: '6437393214f6c10ca270167bc87f0bd95d148b2c49b60784092c45b112d7337c', text: () => import('./assets-chunks/transport_vehicles_index_html.mjs').then(m => m.default)},
    'transport/dashboard/index.html': {size: 2979, hash: '6437393214f6c10ca270167bc87f0bd95d148b2c49b60784092c45b112d7337c', text: () => import('./assets-chunks/transport_dashboard_index_html.mjs').then(m => m.default)},
    'transport/drivers/index.html': {size: 2979, hash: '6437393214f6c10ca270167bc87f0bd95d148b2c49b60784092c45b112d7337c', text: () => import('./assets-chunks/transport_drivers_index_html.mjs').then(m => m.default)},
    'transport/expenses/index.html': {size: 2979, hash: '6437393214f6c10ca270167bc87f0bd95d148b2c49b60784092c45b112d7337c', text: () => import('./assets-chunks/transport_expenses_index_html.mjs').then(m => m.default)},
    'transport/tracking/index.html': {size: 2979, hash: '6437393214f6c10ca270167bc87f0bd95d148b2c49b60784092c45b112d7337c', text: () => import('./assets-chunks/transport_tracking_index_html.mjs').then(m => m.default)},
    'transport/routes/index.html': {size: 2979, hash: '6437393214f6c10ca270167bc87f0bd95d148b2c49b60784092c45b112d7337c', text: () => import('./assets-chunks/transport_routes_index_html.mjs').then(m => m.default)},
    'auth/forgot-password/index.html': {size: 11089, hash: '2aa1f3a633a475b39774869fea17ccf4ac6f4116a197ab2c9c045030805691aa', text: () => import('./assets-chunks/auth_forgot-password_index_html.mjs').then(m => m.default)},
    'styles-7LDC42VY.css': {size: 25290, hash: 'g8RHISNXbMM', text: () => import('./assets-chunks/styles-7LDC42VY_css.mjs').then(m => m.default)}
  },
};
