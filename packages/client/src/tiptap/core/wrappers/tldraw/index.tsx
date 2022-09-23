import { Space, Spin, Typography } from '@douyinfe/semi-ui';
import { NodeViewWrapper } from '@tiptap/react';
import type { TDDocument, TldrawApp } from '@tldraw/tldraw';
import cls from 'classnames';
import { IconDrawPanel } from 'components/icons/IconDrawPanel';
import { Resizable } from 'components/resizable';
import deepEqual from 'deep-equal';
import { Theme as ThemeState, ThemeEnum } from 'hooks/use-theme';
import { useToggle } from 'hooks/use-toggle';
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import { useCallback, useEffect, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Tldraw } from 'tiptap/core/extensions/tldraw';
import { getEditorContainerDOMSize } from 'tiptap/prose-utils';

import styles from './index.module.scss';

const INHERIT_SIZE_STYLE = { width: '100%', height: '100%', maxWidth: '100%' };

const TldrawUI = dynamic(() => import('components/tldraw'), { ssr: false });

export const _TldrawWrapper = ({ editor, node, updateAttributes }) => {
  const { userPrefer } = ThemeState.useHook();
  const isEditable = editor.isEditable;
  const isActive = editor.isActive(Tldraw.name);
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { data, width, height } = node.attrs;
  const [loading, toggleLoading] = useToggle(true);
  // const [error, setError] = useState<Error | null>(null);
  const [visible, toggleVisible] = useToggle(false);

  const [initialDocument, setInitialDocument] = useState<TDDocument>();

  const darkMode = useMemo(() => {
    return userPrefer === ThemeEnum.dark;
  }, [userPrefer]);

  const onResize = useCallback(
    (size) => {
      updateAttributes({ width: size.width, height: size.height });
    },
    [updateAttributes]
  );

  const onViewportChange = useCallback(
    (visible) => {
      if (visible) {
        toggleVisible(true);
      }
    },
    [toggleVisible]
  );

  const onMount = useCallback((app: TldrawApp) => {
    app.setSetting('showGrid', false);
  }, []);

  useEffect(() => {
    setInitialDocument(data);
    toggleLoading(false);
  }, [toggleLoading, data]);

  return (
    <NodeViewWrapper className={cls(styles.wrap, isActive && styles.isActive)}>
      <VisibilitySensor onChange={onViewportChange}>
        <Resizable isEditable={isEditable} width={width} height={height} maxWidth={maxWidth} onChangeEnd={onResize}>
          <div
            className={cls(styles.renderWrap, 'render-wrapper')}
            style={{ ...INHERIT_SIZE_STYLE, overflow: 'hidden' }}
          >
            {/* {error && (
              <div style={INHERIT_SIZE_STYLE}>
                <Text>{error.message || error}</Text>
              </div>
            )} */}

            {loading && <Spin spinning style={INHERIT_SIZE_STYLE}></Spin>}

            {!loading && visible && <TldrawUI readOnly={true} showUI={false} onMount={onMount} darkMode={darkMode} />}

            <div className={styles.title}>
              <Space>
                <span className={styles.icon}>
                  <IconDrawPanel />
                </span>
                画板
              </Space>
            </div>
          </div>
        </Resizable>
      </VisibilitySensor>
    </NodeViewWrapper>
  );
};

export const TldrawWrapper = React.memo(_TldrawWrapper, (prevProps, nextProps) => {
  if (deepEqual(prevProps.node.attrs, nextProps.node.attrs)) {
    return true;
  }

  return false;
});
