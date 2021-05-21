const purgecss = require("@fullhuman/postcss-purgecss")

module.exports = {
  plugins: [
    purgecss({
      content: ["./src/App.svelte"],
      safelist: ["body"],
    }),
  ],
}
