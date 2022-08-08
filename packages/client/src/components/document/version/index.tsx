import { IconChevronLeft } from '@douyinfe/semi-icons';
import { Button, Modal, Timeline, Typography } from '@douyinfe/semi-ui';
import { EditorContent, useEditor } from '@tiptap/react';
import cls from 'classnames';
import { DataRender } from 'components/data-render';
import { LocaleTime } from 'components/locale-time';
import { useDocumentVersion } from 'data/document';
import { safeJSONParse } from 'helpers/json';
import { DocumentVersionControl } from 'hooks/use-document-version';
import { IsOnMobile } from 'hooks/use-on-mobile';
import React, { useCallback, useEffect, useState } from 'react';
import { CollaborationKit } from 'tiptap/editor';

import styles from './index.module.scss';

export interface IProps {
  documentId: string;
  disabled?: boolean;
  onSelect?: (data) => void;
  render?: (arg: { onClick: (arg?: any) => void; disabled: boolean }) => React.ReactNode;
}

const { Title, Text } = Typography;

export const DocumentVersion: React.FC<Partial<IProps>> = ({ documentId, onSelect }) => {
  const { isMobile } = IsOnMobile.useHook();

  const { visible, toggleVisible } = DocumentVersionControl.useHook();
  const { data, loading, error, refresh } = useDocumentVersion(documentId, { enabled: visible });
  const [selectedVersion, setSelectedVersion] = useState(null);

  const editor = useEditor({
    editable: false,
    extensions: CollaborationKit,
    content: { type: 'doc', content: [] },
  });

  const close = useCallback(() => {
    toggleVisible(false);
    setSelectedVersion(null);
  }, [toggleVisible]);

  const select = useCallback(
    (version) => {
      setSelectedVersion(version);
      editor.commands.setContent(safeJSONParse(version.data, { default: {} }).default);
    },
    [editor]
  );

  const restore = useCallback(() => {
    if (!selectedVersion || !onSelect) return;
    onSelect(safeJSONParse(selectedVersion.data, { default: {} }).default);
    close();
  }, [selectedVersion, close, onSelect]);

  useEffect(() => {
    if (!editor) return;
    if (!data.length) return;
    if (selectedVersion) return;
    select(data[0]);
  }, [editor, data, selectedVersion, select]);

  return (
    <>
      <Modal
        title="历史记录"
        fullScreen
        visible={visible}
        style={{ padding: 0 }}
        bodyStyle={{ padding: 0 }}
        header={
          <div className={styles.headerWrap}>
            <div>
              <Button theme="borderless" icon={<IconChevronLeft />} onClick={close} />
              <Title heading={5} style={{ marginLeft: 12 }}>
                版本记录
              </Title>
            </div>
            <div>
              <Button
                theme="light"
                type="primary"
                style={{ marginRight: 8 }}
                disabled={loading || !!error}
                loading={loading}
                onClick={refresh}
              >
                刷新
              </Button>
              <Button type="primary" theme="solid" disabled={!onSelect || !selectedVersion} onClick={restore}>
                恢复此记录
              </Button>
            </div>
          </div>
        }
        footer={null}
      >
        <DataRender
          loading={loading}
          error={error}
          empty={!loading && !data.length}
          normalContent={() => (
            <div className={styles.contentWrap}>
              <main className={cls(isMobile && styles.isMobile)}>
                <div className={'container'}>
                  <EditorContent editor={editor} />
                </div>
              </main>
              <aside className={cls(isMobile && styles.isMobile)}>
                <Timeline mode="left">
                  {data.map(({ version, data, createUser }) => {
                    return (
                      // <div
                      //   key={version}
                      //   className={cls(
                      //     styles.item,
                      //     isMobile && styles.isMobile,
                      //     selectedVersion && selectedVersion.version === version && styles.selected
                      //   )}
                      //   onClick={() => select({ version, data })}
                      // >
                      //   <p>
                      //     <LocaleTime date={+version} />
                      //   </p>
                      //   <p>
                      //     <Text>{createUser && createUser.name}</Text>
                      //   </p>
                      // </div>
                      <Timeline.Item
                        className={cls(
                          styles.item,
                          isMobile && styles.isMobile,
                          selectedVersion && selectedVersion.version === version && styles.selected
                        )}
                        onClick={() => select({ version, data })}
                        type={selectedVersion && selectedVersion.version === version ? 'ongoing' : 'default'}
                        key={version}
                        time={<LocaleTime date={+version} />}
                        extra={
                          <Text ellipsis={{ showTooltip: true }} style={{ width: '100%' }}>
                            作者：{createUser && createUser.name}
                          </Text>
                        }
                      >
                        <Text className={styles.version}>版本：{version}</Text>
                      </Timeline.Item>
                    );
                  })}
                </Timeline>
              </aside>
            </div>
          )}
        />
      </Modal>
    </>
  );
};

export const DocumentVersionTrigger: React.FC<Partial<IProps>> = ({ render, disabled }) => {
  const { toggleVisible } = DocumentVersionControl.useHook();

  return (
    <>
      {render ? (
        render({ onClick: toggleVisible, disabled })
      ) : (
        <>
          <Button type="primary" theme="light" disabled={disabled} onClick={toggleVisible}>
            历史记录
          </Button>
        </>
      )}
    </>
  );
};
