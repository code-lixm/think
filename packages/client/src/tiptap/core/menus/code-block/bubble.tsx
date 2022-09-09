import { Button, Space, Tooltip } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import { IconDuplicate } from 'components/icons/IconDuplicate';
import { IconTrash } from 'components/icons/IconTrash';
import React, { useCallback } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { CodeBlock } from 'tiptap/core/extensions/code-block';
import { copyNode, deleteNode } from 'tiptap/prose-utils';

export const CodeBlockBubbleMenu = ({ editor }) => {
  const shouldShow = useCallback(() => editor.isActive(CodeBlock.name), [editor]);
  const getRenderContainer = useCallback((node) => {
    let container = node;

    // 文本节点
    if (!container.tag) {
      container = node.parentElement;
    }

    while (container && container.classList && !container.classList.contains('node-codeBlock')) {
      container = container.parentElement;
    }

    return container;
  }, []);
  const copyMe = useCallback(() => copyNode(CodeBlock.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(CodeBlock.name, editor), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="code-block-bubble-menu"
      shouldShow={shouldShow}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
      getRenderContainer={getRenderContainer}
    >
      <Space spacing={4}>
        <Tooltip content="复制">
          <Button onClick={copyMe} icon={<IconDuplicate />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Divider />

        <Tooltip content="删除">
          <Button onClick={deleteMe} icon={<IconTrash />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
