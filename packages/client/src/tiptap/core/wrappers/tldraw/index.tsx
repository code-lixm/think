import { Space, Spin, Typography } from '@douyinfe/semi-ui';
import { NodeViewWrapper } from '@tiptap/react';
import type { TDDocument } from '@tldraw/tldraw';
import cls from 'classnames';
import { IconDrawPanel } from 'components/icons/IconDrawPanel';
import { Resizable } from 'components/resizable';
import deepEqual from 'deep-equal';
import { useToggle } from 'hooks/use-toggle';
import dynamic from 'next/dynamic';
import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Tldraw } from 'tiptap/core/extensions/tldraw';
import { getEditorContainerDOMSize } from 'tiptap/prose-utils';

import styles from './index.module.scss';

const { Text } = Typography;

const INHERIT_SIZE_STYLE = { width: '100%', height: '100%', maxWidth: '100%' };

const TldrawUI = dynamic(() => import('components/tldraw'), { ssr: false });

export const _TldrawWrapper = ({ editor, node, updateAttributes }) => {
  const id = 'tl-draw';
  const isEditable = editor.isEditable;
  const isActive = editor.isActive(Tldraw.name);
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { data, width, height } = node.attrs;
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState<Error | null>(null);
  const [visible, toggleVisible] = useToggle(false);

  const [initialDocument, setInitialDocument] = useState<TDDocument>();

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

  useEffect(() => {
    setInitialDocument(data);
    toggleLoading(false);
  }, [toggleLoading, data]);

  // useEffect(() => {
  //   const setContent = async () => {
  //     if (loading || error || !visible || !data) return;

  //     const svg: SVGElement = await exportToSvgRef.current(data);

  //     svg.setAttribute('width', '100%');
  //     svg.setAttribute('height', '100%');
  //     svg.setAttribute('display', 'block');

  //     setSvg(svg);
  //   };
  //   setContent();
  // }, [data, loading, error, visible]);

  return (
    <NodeViewWrapper className={cls(styles.wrap, isActive && styles.isActive)}>
      <VisibilitySensor onChange={onViewportChange}>
        <Resizable isEditable={isEditable} width={width} height={height} maxWidth={maxWidth} onChangeEnd={onResize}>
          <div
            className={cls(styles.renderWrap, 'render-wrapper')}
            style={{ ...INHERIT_SIZE_STYLE, overflow: 'hidden' }}
          >
            {error && (
              <div style={INHERIT_SIZE_STYLE}>
                <Text>{error.message || error}</Text>
              </div>
            )}

            {loading && <Spin spinning style={INHERIT_SIZE_STYLE}></Spin>}

            {!loading && !error && visible && (
              <TldrawUI id={id} readOnly={true} showUI={false} />
              // <div
              //   style={{
              //     height: '100%',
              //     maxHeight: '100%',
              //     padding: 24,
              //     overflow: 'hidden',
              //     display: 'flex',
              //     justifyContent: 'center',
              //     alignItems: 'center',
              //   }}
              //   dangerouslySetInnerHTML={{ __html: Svg?.outerHTML ?? '' }}
              // />
            )}

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
