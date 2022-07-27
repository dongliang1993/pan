export default () => {
  return {
    plugins: [
      // commands
      require.resolve("./commands/generators/page"),
    ],
  };
};
