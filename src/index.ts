import type { Plugin } from "vite";

const IDENTIFIER_START = /[$_\p{ID_Start}]/u;
const IDENTIFIER_CONTINUE = /[$\u200c\u200d_\p{ID_Continue}]/u;

export interface GroutOptions {
  /** File extensions to transform. */
  include?: RegExp;
  /** File paths to leave untouched. */
  exclude?: RegExp;
}

/**
 * Fills every `grout` identifier with `void 0`.
 * Strings, comments, and property names following a dot are left untouched.
 */
export default function grout(options: GroutOptions = {}): Plugin {
  const include = options.include ?? /\.[cm]?[jt]sx?(?:\?.*)?$/;
  const exclude = options.exclude ?? /node_modules/;

  return {
    name: "grout-vite-plugin",
    enforce: "pre",
    transform(code, id) {
      if (!include.test(id) || exclude.test(id)) return null;

      const transformed = fillWithVoid(code);
      if (transformed === code) return null;

      return { code: transformed, map: null };
    },
  };
}

export function fillWithVoid(code: string): string {
  let result = "";
  let cursor = 0;
  let i = 0;
  let state: "code" | "single" | "double" | "template" | "line" | "block" = "code";

  while (i < code.length) {
    const char = code[i];
    const next = code[i + 1];

    if (state === "code") {
      if (char === "'") state = "single";
      else if (char === '"') state = "double";
      else if (char === "`") state = "template";
      else if (char === "/" && next === "/") state = "line";
      else if (char === "/" && next === "*") state = "block";
      else if (IDENTIFIER_START.test(char)) {
        let end = i + 1;
        while (end < code.length && IDENTIFIER_CONTINUE.test(code[end])) end++;

        if (code.slice(i, end) === "grout" && !isPropertyAccess(code, i)) {
          result += code.slice(cursor, i) + "void 0";
          cursor = end;
        }
        i = end;
        continue;
      }
    } else if (state === "line" && (char === "\n" || char === "\r")) {
      state = "code";
    } else if (state === "block" && char === "*" && next === "/") {
      state = "code";
      i += 2;
      continue;
    } else if ((state === "single" || state === "double" || state === "template") && char === "\\") {
      i += 2;
      continue;
    } else if (
      (state === "single" && char === "'") ||
      (state === "double" && char === '"') ||
      (state === "template" && char === "`")
    ) {
      state = "code";
    }

    i++;
  }

  return result + code.slice(cursor);
}

function isPropertyAccess(code: string, start: number): boolean {
  let i = start - 1;
  while (i >= 0 && /\s/.test(code[i])) i--;
  return code[i] === ".";
}
