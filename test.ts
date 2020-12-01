/* eslint-disable import/no-unresolved */
/* eslint-disable unicorn/import-index */
import cssToCssInJs from "./index";

describe("cssToCssInJs()", () => {
  it("ts + individual-folders", () => {
    expect.hasAssertions();
    const source = `
:root {
  --bs-blue: #0d6efd;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
@media (prefers-reduced-motion: no-preference) {
  :root {
    scroll-behavior: smooth;
  }
}
[tabindex="-1"]:focus:not(:focus-visible) {
  outline: 0 !important;
}
hr:not([size]) {
  height: 1px;
}
@media (min-width: 1200px) {
  h1, .h1 {
    font-size: 2.5rem;
  }
}
a:not([href]):not([class]), a:not([href]):not([class]):hover {
  color: inherit;
  text-decoration: none;
}
::-webkit-datetime-edit-fields-wrapper,
::-webkit-datetime-edit-text,
::-webkit-datetime-edit-minute,
::-webkit-datetime-edit-hour-field,
::-webkit-datetime-edit-day-field,
::-webkit-datetime-edit-month-field,
::-webkit-datetime-edit-year-field {
  padding: 0;
}
::file-selector-button {
  font: inherit;
}
.row > * {
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  padding-right: calc(var(--bs-gutter-x) / 2);
  padding-left: calc(var(--bs-gutter-x) / 2);
  margin-top: var(--bs-gutter-y);
}
.alert.alert-danger {color: red;}
.badge {color: blue;}
li ul {color: yellow;}
`;
    expect(
      cssToCssInJs()(source)
    ).toStrictEqual(
      new Map([
        ["globalStyle/index.ts", "export const globalStyle = `:root {\n  --bs-blue: #0d6efd;\n}`;\n"],
        ["alertAlertDangerStyle/index.ts", "export const alertAlertDangerStyle = { color: \"red\" };\n"],
        ["badgeStyle/index.ts", "export const badgeStyle = { color: \"blue\" };\n"],
        ["liUlStyle/index.ts", "export const liUlStyle = { color: \"yellow\" };\n"],
      ])
    );
  });
  it("ts + collection-file", () => {
    expect.hasAssertions();
    const source = `
:root {
  --bs-blue: #0d6efd;
}
.alert.alert-danger {color: red;}
.badge {color: blue;}
li ul {color: yellow;}
`;
    expect(
      cssToCssInJs({formFactor: "collection-file"})(source)
    ).toStrictEqual(
      new Map([
        ["index.ts", "export const globalStyle = `:root {\n  --bs-blue: #0d6efd;\n}`;\n\n\nexport const alertAlertDangerStyle = { color: \"red\" };\n\nexport const badgeStyle = { color: \"blue\" };\n\nexport const liUlStyle = { color: \"yellow\" };\n"],
      ])
    );
  });
  it("js + individual-folders", () => {
    expect.hasAssertions();
    const source = `
.alert.alert-danger {color: red;}
.badge {color: blue;}
`;
    expect(
      cssToCssInJs({extension: "js"})(source)
    ).toStrictEqual(
      new Map([
        ["alertAlertDangerStyle/index.js", "export const alertAlertDangerStyle = { color: \"red\" };\n"],
        ["badgeStyle/index.js", "export const badgeStyle = { color: \"blue\" };\n"],
      ])
    );
  });
  it("js + collection-file", () => {
    expect.hasAssertions();
    const source = `
:root {
  --bs-blue: #0d6efd;
}
.alert.alert-danger {color: red;}
.badge {color: blue;}
li ul {color: yellow;}
`;
    expect(
      cssToCssInJs({formFactor: "collection-file", extension: "js"})(source)
    ).toStrictEqual(
      new Map([
        ["index.js", "export const globalStyle = `:root {\n  --bs-blue: #0d6efd;\n}`;\n\n\nexport const alertAlertDangerStyle = { color: \"red\" };\n\nexport const badgeStyle = { color: \"blue\" };\n\nexport const liUlStyle = { color: \"yellow\" };\n"],
      ])
    );
  });
  it("js + individual-files", () => {
    expect.hasAssertions();
    const source = `
.alert.alert-danger {color: red;}
.badge {color: blue;}
`;
    expect(
      cssToCssInJs({formFactor: "individual-files", extension: "js"})(source)
    ).toStrictEqual(
      new Map([
        ["alertAlertDangerStyle.js", "export const alertAlertDangerStyle = { color: \"red\" };\n"],
        ["badgeStyle.js", "export const badgeStyle = { color: \"blue\" };\n"],
      ])
    );
  });
  it("ts + individual-files", () => {
    expect.hasAssertions();
    const source = `
.alert.alert-danger {color: red;}
.badge {color: blue;}
`;
    expect(
      cssToCssInJs({formFactor: "individual-files"})(source)
    ).toStrictEqual(
      new Map([
        ["alertAlertDangerStyle.ts", "export const alertAlertDangerStyle = { color: \"red\" };\n"],
        ["badgeStyle.ts", "export const badgeStyle = { color: \"blue\" };\n"],
      ])
    );
  });
});
