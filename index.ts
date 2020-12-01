import {parse} from "postcss";
import safe from "postcss-safe-parser";
import type {ProcessOptions} from "postcss";
import type {Root} from "postcss";

interface OptionsType {
  extension?: "ts" | "js";
  formFactor?: "collection-file" | "individual-folders";
  prettier?: Record<string, unknown>;
  processor?: ProcessOptions;
}

const DEFAULT_OPTIONS = {
  extension: "ts" as const,
  formFactor: "individual-folders" as const,
  prettier: {},
  processor: {
    parser: safe,
    map: {inline: true},
  },
};

export default function cssToCssInJs (options: OptionsType = DEFAULT_OPTIONS) {
  return function cssToCssInJsWithOptions (source: string): Map<string, [string, Root]> {
    const mergedOptions = {...DEFAULT_OPTIONS, ...options};
    const {formFactor} = mergedOptions;
    const {extension} = mergedOptions;
    const {processor} = mergedOptions;
    const styleName = "alertStyle";
    const parsedSource = parse(source, {...processor, from: "index.css"});
    const exportedPath = formFactor === "individual-folders" ? `${styleName}/index.${extension}` : `${styleName}.${extension}`;
    const exportedSource = `export const ${styleName} = {color: "red"};`;

    return new Map([
      [exportedPath, [exportedSource, parsedSource]],
    ]);
  };
}
