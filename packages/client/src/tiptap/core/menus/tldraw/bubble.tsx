import { Button, Space, Tooltip } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import { IconAdjust } from 'components/icons/IconAdjust';
import { IconDuplicate } from 'components/icons/IconDuplicate';
import { IconPencil } from 'components/icons/IconPencil';
import { IconTrash } from 'components/icons/IconTrash';
import { SizeSetter } from 'components/size-setter';
import { useUser } from 'data/user';
import { useCallback, useEffect } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { ITldrawAttrs, Tldraw } from 'tiptap/core/extensions/tldraw';
import { useAttributes } from 'tiptap/core/hooks/use-attributes';
import { copyNode, deleteNode, getEditorContainerDOMSize } from 'tiptap/prose-utils';

import { triggerOpenTldrawSettingModal } from '../_event';

export const TldrawBubbleMenu = ({ editor }) => {
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const attrs = useAttributes<ITldrawAttrs>(editor, Tldraw.name, {
    defaultShowPicker: false,
    createUser: '',
    width: 0,
    height: 0,
  });
  const { defaultShowPicker, createUser, width, height } = attrs;
  const { user } = useUser();

  const setSize = useCallback(
    (size) => {
      editor.chain().updateAttributes(Tldraw.name, size).setNodeSelection(editor.state.selection.from).focus().run();
    },
    [editor]
  );
  const openEditLinkModal = useCallback(() => {
    triggerOpenTldrawSettingModal(editor, attrs);
  }, [editor, attrs]);
  const shouldShow = useCallback(() => editor.isActive(Tldraw.name), [editor]);
  const copyMe = useCallback(() => copyNode(Tldraw.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Tldraw.name, editor), [editor]);

  useEffect(() => {
    if (defaultShowPicker && user && createUser === user.id) {
      openEditLinkModal();
      editor.chain().updateAttributes(Tldraw.name, { defaultShowPicker: false }).focus().run();
    }
  }, [createUser, defaultShowPicker, editor, openEditLinkModal, user]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="tldraw-bubble-menu"
      shouldShow={shouldShow}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
    >
      <Space spacing={4}>
        <Tooltip content="复制">
          <Button onClick={copyMe} icon={<IconDuplicate />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Tooltip content="编辑">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconPencil />} onClick={openEditLinkModal} />
        </Tooltip>

        <SizeSetter width={width} maxWidth={maxWidth} height={height} onOk={setSize}>
          <Tooltip content="设置宽高">
            <Button icon={<IconAdjust />} type="tertiary" theme="borderless" size="small" />
          </Tooltip>
        </SizeSetter>

        <Divider />

        <Tooltip content="删除">
          <Button onClick={deleteMe} icon={<IconTrash />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};