import assert from "node:assert/strict";
import test from "node:test";

const {
  CORE_STYLESHEET_ATTRIBUTE,
  CORE_STYLESHEET_PATHS,
  setCoreStylesEnabled
} = await import("../../.tmp-tests/core/core-styles.js");

function createFakeDocument() {
  const links = [];
  const head = {
    append(link) {
      links.push(link);
    }
  };

  return {
    links,
    document: {
      head,
      createElement(tagName) {
        assert.equal(tagName, "link");
        const attributes = new Map();
        return {
          rel: "",
          href: "",
          setAttribute(name, value) {
            attributes.set(name, value);
          },
          getAttribute(name) {
            return attributes.get(name) ?? null;
          },
          remove() {
            const index = links.indexOf(this);
            if (index >= 0) links.splice(index, 1);
          }
        };
      },
      querySelectorAll(selector) {
        assert.equal(selector, `link[${CORE_STYLESHEET_ATTRIBUTE}]`);
        return links.filter((link) => link.getAttribute(CORE_STYLESHEET_ATTRIBUTE) !== null);
      }
    }
  };
}

test("loads both Core stylesheets in their declared order", () => {
  const fake = createFakeDocument();

  setCoreStylesEnabled(true, fake.document, "1.0.8");

  assert.deepEqual(
    fake.links.map((link) => link.getAttribute(CORE_STYLESHEET_ATTRIBUTE)),
    [...CORE_STYLESHEET_PATHS]
  );
  assert.deepEqual(
    fake.links.map((link) => link.href),
    CORE_STYLESHEET_PATHS.map((path) => `${path}?v=1.0.8`)
  );
});

test("does not duplicate managed stylesheet links", () => {
  const fake = createFakeDocument();

  setCoreStylesEnabled(true, fake.document);
  setCoreStylesEnabled(true, fake.document);

  assert.equal(fake.links.length, CORE_STYLESHEET_PATHS.length);
});

test("removes only Core-managed stylesheet links when debugging CSS is disabled", () => {
  const fake = createFakeDocument();
  const unrelatedLink = fake.document.createElement("link");
  unrelatedLink.setAttribute("data-another-module", "true");
  fake.links.push(unrelatedLink);
  setCoreStylesEnabled(true, fake.document);

  setCoreStylesEnabled(false, fake.document);

  assert.deepEqual(fake.links, [unrelatedLink]);
});
