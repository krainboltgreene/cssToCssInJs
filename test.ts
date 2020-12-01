/* eslint-disable import/no-unresolved */
/* eslint-disable unicorn/import-index */
import cssToCssInJs from "./index";

describe("cssToCssInJs()", () => {
  it("1", () => {
    expect.hasAssertions();
    expect(
      cssToCssInJs()(".alert {color: red}")
    ).toStrictEqual(
      new Map([
        ["alertStyle/index.ts", "export const alertStyle = {color: \"red\"};"],
      ])
    );
  });
  it("2", () => {
    expect.hasAssertions();
    expect(
      cssToCssInJs({formFactor: "collection-file"})(".alert {color: red}")
    ).toStrictEqual(
      new Map([
        ["alertStyle.ts", "export const alertStyle = {color: \"red\"};"],
      ])
    );
  });
  it("3", () => {
    expect.hasAssertions();
    expect(
      cssToCssInJs({extension: "js"})(".alert {color: red}")
    ).toStrictEqual(
      new Map([
        ["alertStyle/index.js", "export const alertStyle = {color: \"red\"};"],
      ])
    );
  });
  it("4", () => {
    expect.hasAssertions();
    expect(
      cssToCssInJs({formFactor: "collection-file", extension: "js"})(".alert {color: red}")
    ).toStrictEqual(
      new Map([
        ["alertStyle.js", "export const alertStyle = {color: \"red\"};"],
      ])
    );
  });
});
