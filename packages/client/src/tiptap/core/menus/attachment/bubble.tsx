import { Button, Space, Tooltip } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import { IconDuplicate } from 'components/icons/IconDuplicate';
import { IconTrash } from 'components/icons/IconTrash';
import { useCallback } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { Attachment } from 'tiptap/core/extensions/attachment';
import { copyNode, deleteNode } from 'tiptap/prose-utils';

export const AttachmentBubbleMenu = ({ editor }) => {
  const copyMe = useCallback(() => copyNode(Attachment.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Attachment.name, editor), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="attachment-bubble-menu"
      shouldShow={() => editor.isActive(Attachment.name)}
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
