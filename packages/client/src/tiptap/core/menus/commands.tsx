import { Dropdown, Popover } from '@douyinfe/semi-ui';
import { IUser } from '@think/domains';
import { GridSelect } from 'components/grid-select';
import {
  IconAttachment,
  IconCallout,
  IconCodeBlock,
  IconCountdown,
  IconDocument,
  IconImage,
  IconLayout,
  IconLink,
  IconMath,
  IconMind,
  IconStatus,
  IconTable,
  IconTableOfContents,
} from 'components/icons';
import { IconDrawPanel } from 'components/icons/IconDrawPanel';
import { createKeysLocalStorageLRUCache } from 'helpers/lru-cache';
import { Editor } from 'tiptap/core';

import { createCountdown } from './countdown/service';

export type ITitle = {
  title: string;
};

// type ICommandShortcut = {};

type IBaseCommand = {
  isBlock?: boolean;
  icon: React.ReactNode;
  label: string;
  user?: IUser;
  shortcut: string;
};

type IAction = (editor: Editor, user?: IUser) => void;

export type ILabelRenderCommand = IBaseCommand & {
  action: IAction;
};

type ICustomRenderCommand = IBaseCommand & {
  custom: (
    editor: Editor,
    runCommand: (arg: { label: string; action: IAction }) => any,
    key: string
  ) => React.ReactNode;
};

export type ICommand = ITitle | ILabelRenderCommand | ICustomRenderCommand;

export const insertMenuLRUCache = createKeysLocalStorageLRUCache('TIPTAP_INSERT_MENU', 3);

export const COMMANDS: ICommand[] = [
  {
    title: '通用',
  },
  {
    icon: <IconTableOfContents />,
    label: '目录',
    shortcut: '/ml',
    action: (editor) => editor.chain().focus().setTableOfContents().run(),
  },
  {
    isBlock: true,
    icon: <IconTable />,
    label: '表格',
    shortcut: '/bg',
    custom: (editor, runCommand, key) => (
      <Popover
        key={key}
        showArrow
        position="rightTop"
        zIndex={10000}
        content={
          <div style={{ padding: 0 }}>
            <GridSelect
              onSelect={({ rows, cols }) => {
                return runCommand({
                  label: '表格',
                  action: (editor) => {
                    editor.chain().focus().run();
                    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
                  },
                })();
              }}
            />
          </div>
        }
      >
        <Dropdown.Item key="table">
          <IconTable />
          表格
        </Dropdown.Item>
      </Popover>
    ),
  },
  {
    isBlock: true,
    icon: <IconLink />,
    label: '外链',
    shortcut: '/wl',
    action: (editor, user) =>
      editor.chain().focus().setIframe({ url: '', defaultShowPicker: true, createUser: user.id }).run(),
  },
  {
    isBlock: true,
    icon: <IconLayout />,
    label: '布局',
    shortcut: '/bj',
    custom: (editor, runCommand, key) => (
      <Popover
        key={key}
        showArrow
        position="rightTop"
        zIndex={10000}
        content={
          <div style={{ padding: 0 }}>
            <GridSelect
              rows={1}
              cols={5}
              onSelect={({ cols }) => {
                return runCommand({
                  label: '布局',
                  action: (editor) => {
                    console.log('editor: ', editor);
                    editor.chain().focus().run();
                    editor.chain().insertColumns({ cols }).focus().run();
                  },
                })();
              }}
            />
          </div>
        }
      >
        <Dropdown.Item key="layout">
          <IconLayout />
          布局
        </Dropdown.Item>
      </Popover>
    ),
  },
  {
    isBlock: true,
    icon: <IconCodeBlock />,
    label: '代码块',
    shortcut: '/dmk',
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    isBlock: true,
    icon: <IconImage />,
    label: '图片',
    shortcut: '/tp',
    action: (editor) => editor.chain().focus().setEmptyImage({ width: '100%' }).run(),
  },
  {
    isBlock: true,
    icon: <IconAttachment />,
    label: '附件',
    shortcut: '/fj',
    action: (editor) => editor.chain().focus().setAttachment().run(),
  },
  {
    isBlock: true,
    icon: <IconCountdown />,
    label: '倒计时',
    shortcut: '/djs',
    action: (editor) => createCountdown(editor),
  },
  {
    isBlock: true,
    icon: <IconCodeBlock />,
    label: '代码块',
    shortcut: '/dmk',
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: '卡片',
    shortcut: '/kp',
  },
  {
    icon: <IconStatus />,
    label: '状态',
    shortcut: '/zt',
    action: (editor, user) => editor.chain().focus().setStatus({ defaultShowPicker: true, createUser: user.id }).run(),
  },
  {
    isBlock: true,
    icon: <IconDrawPanel />,
    label: '画板',
    shortcut: '/hb',
    action: (editor, user) => {
      editor.chain().focus().setTldraw({ width: '100%', defaultShowPicker: true, createUser: user.id }).run();
    },
  },
  {
    isBlock: true,
    icon: <IconCallout />,
    label: '高亮块',
    shortcut: '/glk',
    action: (editor) => editor.chain().focus().setCallout().run(),
  },
  {
    isBlock: true,
    icon: <IconMind />,
    label: '思维导图',
    shortcut: '/swdt',
    action: (editor, user) => {
      editor.chain().focus().setMind({ width: '100%', defaultShowPicker: true, createUser: user.id }).run();
    },
  },
  {
    isBlock: true,
    icon: <IconMath />,
    label: '数学公式',
    shortcut: '/sxgs',
    action: (editor, user) => editor.chain().focus().setKatex({ defaultShowPicker: true, createUser: user.id }).run(),
  },
  {
    title: '内容引用',
    shortcut: '/nryy',
  },
  {
    isBlock: true,
    icon: <IconDocument />,
    label: '文档',
    shortcut: '/wd',
    action: (editor, user) =>
      editor.chain().focus().setDocumentReference({ defaultShowPicker: true, createUser: user.id }).run(),
  },
  {
    isBlock: true,
    icon: <IconDocument />,
    label: '子文档',
    shortcut: '/zwd',
    action: (editor) => editor.chain().focus().setDocumentChildren().run(),
  },
];

export const QUICK_INSERT_COMMANDS: any[] = [
  ...COMMANDS.slice(0, 1),
  {
    icon: <IconTable />,
    label: '表格',
    shortcut: '/bg',
    action: (editor: Editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    isBlock: true,
    icon: <IconLayout />,
    label: '布局',
    action: (editor) => editor.chain().focus().insertColumns({ cols: 2 }).run(),
  },
  ...COMMANDS.slice(4),
];

export const transformToCommands = (commands, data: string[]) => {
  return (data || [])
    .map((label) => {
      return commands.find((command) => {
        if ('title' in command) {
          return false;
        }

        return command.label === label;
      });
    })
    .filter(Boolean);
};
