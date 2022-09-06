import { IllustrationNoAccess, IllustrationNoAccessDark } from '@douyinfe/semi-illustrations';
import { Button, Empty, Space, Spin, Typography } from '@douyinfe/semi-ui';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { DataRender } from 'components/data-render';
import deepEqual from 'deep-equal';
import { useToggle } from 'hooks/use-toggle';
import Link from 'next/link';
// import { SecureDocumentIllustration } from 'illustrations/secure-document';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Editor } from 'tiptap/core';
import { IndexeddbPersistence } from 'tiptap/core/thirty-part/y-indexeddb';

import { EditorInstance } from './editor';
import styles from './index.module.scss';
import { ICollaborationEditorProps, ProviderStatus } from './type';

const { Text } = Typography;

export type ICollaborationRefProps = {
  getEditor: () => Editor;
};

export const CollaborationEditor = forwardRef((props: ICollaborationEditorProps, ref) => {
  const {
    id: documentId,
    type,
    editable,
    onTitleUpdate,
    user,
    menubar,
    hideComment,
    renderInEditorPortal,
    onAwarenessUpdate,
  } = props;
  const $editor = useRef<Editor>();
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState<ProviderStatus>('connecting');
  const lastAwarenessRef = useRef([]);

  const hocuspocusProvider = useMemo(() => {
    return new HocuspocusProvider({
      url: process.env.COLLABORATION_API_URL,
      name: documentId,
      token: (user && user.token) || 'read-public',
      parameters: {
        targetId: documentId,
        userId: user && user.id,
        docType: type,
        editable,
      },
      maxAttempts: 1,
      onAwarenessUpdate: ({ states }) => {
        const users = states.map((state) => ({ clientId: state.clientId, user: state.user }));
        if (deepEqual(user, lastAwarenessRef.current)) {
          return;
        }
        onAwarenessUpdate && onAwarenessUpdate(users);
        lastAwarenessRef.current = users;
      },
      onAuthenticationFailed() {
        toggleLoading(false);
        setError(new Error('鉴权失败！暂时无法提供服务'));
      },
      onSynced() {
        toggleLoading(false);
      },
      onStatus({ status }) {
        setStatus(status);
      },
    } as any);
  }, [documentId, user, type, editable, onAwarenessUpdate, toggleLoading]);

  useImperativeHandle(
    ref,
    () =>
      ({
        getEditor: () => $editor.current,
      } as ICollaborationRefProps)
  );

  // 离线缓存
  useEffect(() => {
    if (!editable) return;
    const indexdbProvider = new IndexeddbPersistence(documentId, hocuspocusProvider.document);
    indexdbProvider.on('synced', () => {
      setStatus('loadCacheSuccess');
    });

    return () => {
      if (indexdbProvider) {
        indexdbProvider.destroy();
      }
    };
  }, [editable, documentId, hocuspocusProvider]);

  useEffect(() => {
    return () => {
      if (hocuspocusProvider) {
        hocuspocusProvider.destroy();
      }
    };
  }, [hocuspocusProvider]);

  return (
    <>
      <div className={styles.wrap}>
        <DataRender
          loading={loading}
          loadingContent={
            <div style={{ margin: 'auto' }}>
              <Spin />
            </div>
          }
          error={error}
          errorContent={(error) => (
            <div
              style={{
                margin: '10%',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* <SecureDocumentIllustration /> */}
              <Empty
                image={<IllustrationNoAccess style={{ width: 250, height: 250 }} />}
                darkModeImage={<IllustrationNoAccessDark style={{ width: 250, height: 250 }} />}
              />
              <Space vertical spacing="loose">
                <Text style={{ marginTop: 12 }} type="danger">
                  {(error && (error as Error).message) || '未知错误'}
                </Text>
                <Button>
                  <Link href="/">回到主页</Link>
                </Button>
              </Space>
            </div>
          )}
          normalContent={() => (
            <EditorInstance
              ref={$editor}
              documentId={documentId}
              editable={editable}
              menubar={menubar}
              hocuspocusProvider={hocuspocusProvider}
              onTitleUpdate={onTitleUpdate}
              user={user}
              status={status}
              hideComment={hideComment}
              renderInEditorPortal={renderInEditorPortal}
            />
          )}
        />
      </div>
    </>
  );
});

CollaborationEditor.displayName = 'CollaborationEditor';
