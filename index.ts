/* eslint-disable no-sync */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import {parse} from "postcss";
import {format} from "prettier";
import {camel} from "case";
import postcssSafeParser from "postcss-safe-parser";
import postcssSelectorParser from "postcss-selector-parser";
import type {Options} from "prettier";
import type {ProcessOptions} from "postcss";
import type {ChildNode} from "postcss";
import type {Selector} from "postcss-selector-parser";
import type {ClassName} from "postcss-selector-parser";
import type {Universal} from "postcss-selector-parser";
import type {Attribute} from "postcss-selector-parser";
import type {Combinator} from "postcss-selector-parser";
import type {Comment} from "postcss-selector-parser";
import type {Identifier} from "postcss-selector-parser";
import type {Nesting} from "postcss-selector-parser";
import type {Pseudo} from "postcss-selector-parser";
import type {Root} from "postcss-selector-parser";
import type {Tag} from "postcss-selector-parser";
import type {String as SelectorString} from "postcss-selector-parser";


// TODO: Handle selectors `a, b`

interface OptionsType {
  extension?: "ts" | "js";
  formFactor?: "collection-file" | "individual-folders" | "individual-files";
  prettier?: Options;
  processor?: ProcessOptions;
}

const DEFAULT_OPTIONS = {
  extension: "ts" as const,
  formFactor: "individual-folders" as const,
  prettier: {
    parser: "babel",
  },
  processor: {
    parser: postcssSafeParser,
    map: {inline: true},
  },
};
const pathFormat = (formFactor: OptionsType["formFactor"], suffix: string) => (prefix: string): string => {
  switch (formFactor) {
    case "individual-folders": {
      return `${prefix}/index.${suffix}`;
    }
    case "collection-file": {
      return `index.${suffix}`;
    }
    case "individual-files": {
      return `${prefix}.${suffix}`;
    }
    default: {
      throw new Error("Invalid formFactor");
    }
  }
};
const styleNameFormat = (selectorString: string): string => {
  return camel(postcssSelectorParser().astSync(selectorString).nodes.flatMap((selector: Selector): Array<string> => selector.nodes.map((name: SelectorString | Tag | Root | Pseudo | Nesting | Identifier | Comment | Combinator | ClassName | Attribute | Universal | Tag | Root | Pseudo | Nesting | Identifier | Comment | Combinator | ClassName | Attribute | Universal): string => name.value ?? "")).join(" "));
};
const nodesFormat = (nodes: Array<ChildNode>): string => {
  return nodes.map((node: ChildNode): string => {
    switch (node.type) {
      case "decl": {
        return `${camel(node.prop)}: "${node.value}"`;
      }
      case "atrule":
      case "rule":
      case "comment":
      default: {
        throw new Error(`Invalid node type: ${node.type}`);
      }
    }
  }).join(",");
};
const exportStyle = (name: string, properties: string, prettier: Options, left: string, right: string): string => format(`export const ${name} = ${left}${properties}${right};`, prettier);

export default function cssToCssInJs (options: OptionsType = DEFAULT_OPTIONS) {
  return function cssToCssInJsWithOptions (source: string): Map<string, string> {
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      prettier: {
        ...DEFAULT_OPTIONS.prettier,
        ...options.prettier,
      },
      processor: {
        ...DEFAULT_OPTIONS.processor,
        ...options.processor,
      },
    };
    const {formFactor} = mergedOptions;
    const {processor} = mergedOptions;
    const {prettier} = mergedOptions;
    const {extension} = mergedOptions;
    const parsedSource = parse(source, {...processor, from: "index.css"});
    const exportedPath = pathFormat(formFactor, extension);

    switch (formFactor) {
      case "individual-files":
      case "individual-folders": {
        return new Map(parsedSource.nodes.reduce((mapping: Readonly<Array<[string, string]>>, node: ChildNode): Array<[string, string]> => {
          switch (node.type) {
            case "rule": {
              const {selector} = node;
              const {nodes} = node;
              const exportedProperties = nodesFormat(nodes);
              if (selector === ":root") {
                return [[exportedPath("globalStyle"), exportStyle("globalStyle", node.toString(), prettier, "`", "`")], ...mapping];
              }
              const styleName = `${styleNameFormat(selector)}Style`;

              return [...mapping, [exportedPath(styleName), exportStyle(styleName, exportedProperties, prettier, "{", "}")]];
            }
            case "atrule":
            case "decl":
            case "comment":
            default: {
              throw new Error(`Invalid node type: ${node.type}`);
            }
          }
        }, []));
      }
      case "collection-file": {
        return new Map([
          [exportedPath("index"), parsedSource.nodes.reduce((mapping: string, node: ChildNode): string => {
            switch (node.type) {
              case "rule": {
                const {selector} = node;
                const {nodes} = node;
                const exportedProperties = nodesFormat(nodes);
                if (selector === ":root") {
                  return `${exportStyle("globalStyle", node.toString(), prettier, "`", "`")}\n${mapping}`;
                }
                const styleName = `${styleNameFormat(selector)}Style`;

                return `${mapping}\n${exportStyle(styleName, exportedProperties, prettier, "{", "}")}`;
              }
              case "atrule":
              case "decl":
              case "comment":
              default: {
                throw new Error(`Invalid node type: ${node.type}`);
              }
            }
          }, "")],
        ]);
      }
      default: {
        throw new Error("Invalid formFactor");
      }
    }
  };
}
