export default () => {
  return {
    plugins: [
      // commands
      require.resolve('./commands/generators/page'),
      require.resolve('./commands/generators/prettier'),
      require.resolve('./commands/version'),
      require.resolve('./commands/plugin'),
    ],
  }
}
