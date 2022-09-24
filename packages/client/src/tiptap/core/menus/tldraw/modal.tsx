import { Modal } from '@douyinfe/semi-ui';
import { TDDocument, TldrawApp } from '@tldraw/tldraw';
import { useToggle } from 'hooks/use-toggle';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { uploadFile } from 'services/file';
import { Editor } from 'tiptap/core';
import { ITldrawAttrs } from 'tiptap/core/extensions/tldraw';

import { cancelSubject, OPEN_TLDRAW_SETTING_MODAL, subject } from '../_event';

type IProps = { editor: Editor };

// const { Text } = Typography;
const Tldraw = dynamic(() => import('components/tldraw'), { ssr: false });

export const TldrawSettingModal: React.FC<IProps> = ({ editor }) => {
  const tlDrawAppRef = useRef<TldrawApp>();
  const [visible, toggleVisible] = useToggle(false);
  const [initialDocument, setInitialDocument] = useState<TDDocument>();

  const onMount = useCallback(
    (app: TldrawApp) => {
      app.setSetting('language', 'zh-ch');
      app.setSetting('dockPosition', 'left');
      initialDocument && app.loadDocument(initialDocument);
      tlDrawAppRef.current = app;
    },
    [initialDocument]
  );

  const save = useCallback(() => {
    const app = tlDrawAppRef.current;
    if (!app) {
      toggleVisible(false);
      return;
    }
    console.log('app.document: ', app.document);
    editor.chain().focus().setTldraw({ data: app.document }).run();
    toggleVisible(false);
  }, [toggleVisible, editor]);

  const onAssetCreate = useCallback(async (app: TldrawApp, file: File, id: string): Promise<string | false> => {
    const res = await uploadFile(file);
    return res;
  }, []);

  useEffect(() => {
    const handler = (data: ITldrawAttrs) => {
      toggleVisible(!visible);
      if (!visible) {
        setInitialDocument(data.data);
      }
    };

    subject(editor, OPEN_TLDRAW_SETTING_MODAL, handler);

    return () => {
      cancelSubject(editor, OPEN_TLDRAW_SETTING_MODAL, handler);
    };
  }, [editor, visible, toggleVisible]);

  return (
    <Modal
      title="画板"
      fullScreen
      visible={visible}
      onCancel={save}
      onOk={save}
      okText="保存"
      cancelText="退出"
      motion={false}
      footer={null}
      header={null}
    >
      <div style={{ height: '100%', margin: '0 -24px', border: '1px solid var(--semi-color-border)' }}>
        <div style={{ width: '100%', height: '100%' }}>
          {visible && (
            <Tldraw
              showPages={false}
              disableAssets={false}
              showMultiplayerMenu={false}
              document={initialDocument}
              onMount={onMount}
              onAssetCreate={onAssetCreate}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
