# cssToCssInJs

This library takes in any form of style sheet (parsable by postcss, so with the proper parers: css, scss, sass, less, etc) and outputs the css-in-js style object.

``` js
import cssToCssInJs from "css-to-css-in-js";

cssToCssInJs()(".a {color: red}")
// new Map([
//   ["aStyle/index.ts", "export const aStyle = { color: \"red\" };\n"],
// ])
```
