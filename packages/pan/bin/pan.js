#!/usr/bin/env node

// require('../dist/cli/cli.js')
require('../src/cli/cli.ts')
  .run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
