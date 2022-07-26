require('../dist/cli')
  .run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
