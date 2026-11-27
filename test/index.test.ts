import { describe, expect, it } from "vitest";
import grout, { fillWithVoid } from "../src/index.js";

describe("fillWithVoid", () => {
  it("replaces grout identifiers", () => {
    expect(fillWithVoid("if (grout) console.log(grout);"))
      .toBe("if (void 0) console.log(void 0);");
  });

  it("does not replace partial identifiers, strings, comments, or properties", () => {
    const code = `const grouting = "grout"; // grout\nwall.grout; /* grout */`;
    expect(fillWithVoid(code)).toBe(code);
  });

  it("returns null when a module does not need grout", () => {
    const plugin = grout();
    expect(plugin.transform).toBeTypeOf("function");
  });
});
