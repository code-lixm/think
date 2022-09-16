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
import { Flow, IFlowAttrs } from 'tiptap/core/extensions/flow';
import { useAttributes } from 'tiptap/core/hooks/use-attributes';
import { copyNode, deleteNode, getEditorContainerDOMSize } from 'tiptap/prose-utils';

import { triggerOpenFlowSettingModal } from '../_event';

export const FlowBubbleMenu = ({ editor }) => {
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const attrs = useAttributes<IFlowAttrs>(editor, Flow.name, {
    defaultShowPicker: false,
    createUser: '',
    width: 0,
    height: 0,
  });
  const { defaultShowPicker, createUser, width, height } = attrs;
  const { user } = useUser();

  const setSize = useCallback(
    (size) => {
      editor.chain().updateAttributes(Flow.name, size).setNodeSelection(editor.state.selection.from).focus().run();
    },
    [editor]
  );
  const openEditLinkModal = useCallback(() => {
    triggerOpenFlowSettingModal(editor, attrs);
  }, [editor, attrs]);
  const shouldShow = useCallback(() => editor.isActive(Flow.name), [editor]);
  const copyMe = useCallback(() => copyNode(Flow.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Flow.name, editor), [editor]);

  useEffect(() => {
    if (defaultShowPicker && user && createUser === user.id) {
      openEditLinkModal();
      editor.chain().updateAttributes(Flow.name, { defaultShowPicker: false }).focus().run();
    }
  }, [createUser, defaultShowPicker, editor, openEditLinkModal, user]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="flow-bubble-menu"
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
