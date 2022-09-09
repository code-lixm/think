import { Button, Space, Tooltip } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import { IconDuplicate } from 'components/icons/IconDuplicate';
import { IconTrash } from 'components/icons/IconTrash';
import React, { useCallback } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { DocumentChildren } from 'tiptap/core/extensions/document-children';
import { copyNode, deleteNode } from 'tiptap/prose-utils';

export const DocumentChildrenBubbleMenu = ({ editor }) => {
  const shouldShow = useCallback(() => editor.isActive(DocumentChildren.name), [editor]);
  const copyMe = useCallback(() => copyNode(DocumentChildren.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(DocumentChildren.name, editor), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="document-children-bubble-menu"
      shouldShow={shouldShow}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
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
