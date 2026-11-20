# Berkeley Mono

Berkeley Mono is a commercial font (https://usgraphics.com/products/berkeley-mono)
and can't be bundled here. After purchasing, drop the web files in this folder as:

- `BerkeleyMono-Regular.woff2`
- `BerkeleyMono-Bold.woff2`

The `@font-face` rules in `app/globals.css` pick them up automatically.
Until then the site falls back to JetBrains Mono (or a locally installed
Berkeley Mono, if the visitor has one).
