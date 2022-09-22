import { Modal } from '@douyinfe/semi-ui';
import type { TldrawApp } from '@tldraw/tldraw';
import { useToggle } from 'hooks/use-toggle';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from 'tiptap/core';

import { cancelSubject, OPEN_TLDRAW_SETTING_MODAL, subject } from '../_event';

type IProps = { editor: Editor };

// const { Text } = Typography;
const Tldraw = dynamic(() => import('components/tldraw'), { ssr: false });

export const TldrawSettingModal: React.FC<IProps> = ({ editor }) => {
  const id = 'tl-draw';
  const tlDrawAppRef = useRef<TldrawApp>();
  const [visible, toggleVisible] = useToggle(false);

  const onDrawMount = useCallback((app: TldrawApp) => {
    tlDrawAppRef.current = app;
    app.setSetting('language', 'zh-ch');
    app.setSetting('dockPosition', 'left');
  }, []);

  const onChange = useCallback((app, reason) => {
    console.log('app, reason: ', app, reason);
  }, []);

  const save = useCallback(() => {
    if (!tlDrawAppRef.current) {
      toggleVisible(false);
      return;
    }

    editor.chain().focus().setTldraw({ data: tlDrawAppRef.current.document }).run();
    toggleVisible(false);
  }, [toggleVisible, editor]);

  useEffect(() => {
    const handler = (data) => {
      toggleVisible(true);
      if (tlDrawAppRef.current && data) {
        tlDrawAppRef.current.loadDocument(data);
      }
    };

    subject(editor, OPEN_TLDRAW_SETTING_MODAL, handler);

    return () => {
      cancelSubject(editor, OPEN_TLDRAW_SETTING_MODAL, handler);
    };
  }, [editor, toggleVisible]);

  return (
    <Modal
      title="画板"
      fullScreen
      visible={visible}
      onCancel={toggleVisible}
      onOk={save}
      okText="保存"
      cancelText="退出"
      motion={false}
      footer={null}
      header={null}
    >
      <div style={{ height: '100%', margin: '0 -24px', border: '1px solid var(--semi-color-border)' }}>
        <div style={{ width: '100%', height: '100%' }}>
          {/* {!error ? (
            <Tldraw id={id} showPages={false} showMultiplayerMenu={false} onChange={onChange} onMount={onDrawMount} />
          ) : null} */}
          <Tldraw id={id} autofocus showPages={false} showMultiplayerMenu={false} onMount={onDrawMount} />
        </div>
      </div>
    </Modal>
  );
};
