import { IUser } from '@think/domains';
import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import type { TDDocument } from '@tldraw/tldraw';
import { TldrawWrapper } from 'tiptap/core/wrappers/tldraw';
import { getDatasetAttribute, nodeAttrsToDataset } from 'tiptap/prose-utils';

// const DEFAULT_TLDRAW_DATA = {
//   id: 'tldraw-doc',
//   name: 'New Document',
//   version: 1,
//   pages: {},
//   pageStates: {},
//   assets: {},
// };
const DEFAULT_TLDRAW_DATA: TDDocument = undefined;

export interface ITldrawAttrs {
  defaultShowPicker?: boolean;
  createUser?: IUser['id'];
  width?: number | string;
  height?: number;
  data?: TDDocument;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tldraw: {
      setTldraw: (attrs?: ITldrawAttrs) => ReturnType;
    };
  }
}

export const Tldraw = Node.create({
  name: 'tldraw',
  group: 'block',
  selectable: true,
  atom: true,
  draggable: true,
  inline: false,

  addAttributes() {
    return {
      defaultShowPicker: {
        default: false,
      },
      createUser: {
        default: null,
      },
      width: {
        default: '100%',
        parseHTML: getDatasetAttribute('width'),
      },
      height: {
        default: 240,
        parseHTML: getDatasetAttribute('height'),
      },
      data: {
        default: DEFAULT_TLDRAW_DATA,
        parseHTML: getDatasetAttribute('data', true),
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'tldraw',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[class=tldraw]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, nodeAttrsToDataset(node))];
  },

  addCommands() {
    return {
      setTldraw:
        (options) =>
        ({ tr, commands, chain, editor }) => {
          options = options || {};
          options.data = options.data || DEFAULT_TLDRAW_DATA;

          // @ts-ignore
          if (tr.selection?.node?.type?.name == this.name) {
            return commands.updateAttributes(this.name, options);
          }

          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(TldrawWrapper);
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$tldraw\$$/,
        type: this.type,
        getAttributes: () => {
          return { width: '100%' };
        },
      }),
    ];
  },
});
