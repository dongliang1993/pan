#!/usr/bin/env node

require('../dist/cli/cli.js')
  .run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
