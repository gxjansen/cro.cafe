import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import type { RehypePlugin, RemarkPlugin } from '@astrojs/markdown-remark';
import type { Root, Element } from 'hast';

export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree: Root) {
    if (!Array.isArray(tree.children)) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i] as Element | undefined;

      if (
        child &&
        'type' in child &&
        'tagName' in child &&
        child.type === 'element' &&
        child.tagName === 'table'
      ) {
        const wrapper: Element = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
          },
          children: [child],
        };

        tree.children[i] = wrapper;
        i++;
      }
    }
  };
};

export const lazyImagesRehypePlugin: RehypePlugin = () => {
  return function (tree: Root) {
    if (!Array.isArray(tree.children)) return;

    visit(tree, 'element', function (node: Element) {
      if ('tagName' in node && node.tagName === 'img') {
        if (!node.properties) {
          node.properties = {};
        }
        node.properties.loading = 'lazy';
      }
    });
  };
};
