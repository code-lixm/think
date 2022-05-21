import { Button, Space, Spin, Typography } from '@douyinfe/semi-ui';
import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { IconMindCenter, IconZoomIn, IconZoomOut } from 'components/icons';
import { Resizeable } from 'components/resizeable';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { load, renderXml } from 'thirtypart/diagram';
import { Flow } from 'tiptap/core/extensions/flow';
import { getEditorContainerDOMSize } from 'tiptap/prose-utils';

import styles from './index.module.scss';

const { Text } = Typography;
const INHERIT_SIZE_STYLE = { width: '100%', height: '100%', maxWidth: '100%' };
const ICON_STYLE = { fontSize: '0.85em' };

export const FlowWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const isActive = editor.isActive(Flow.name);
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { data, width, height } = node.attrs;
  const $graph = useRef(null);
  const $container = useRef<HTMLElement>();
  const [bgColor, setBgColor] = useState('var(--semi-color-fill-0)');
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState(null);

  const center = useCallback(() => {
    const graph = $graph.current;
    if (!graph) return;
    graph.fit();
    graph.center();
  }, []);

  const zoomOut = useCallback(() => {
    const graph = $graph.current;
    if (!graph) return;
    graph.zoomOut();
  }, []);

  const zoomIn = useCallback(() => {
    const graph = $graph.current;
    if (!graph) return;
    graph.zoomIn();
  }, []);

  const onResize = useCallback(
    (size) => {
      updateAttributes({ width: size.width, height: size.height });
    },
    [updateAttributes]
  );

  const render = useCallback(
    (div) => {
      if (!div) return;

      if (!$graph.current) {
        const graph = renderXml(div, data);
        $graph.current = graph;
      } else {
        $graph.current.setXml(data);
      }

      $graph.current.fit();
      $graph.current.zoom(0.8);
      $graph.current.center();
    },
    [data]
  );

  const setMxgraph = useCallback(
    (div) => {
      $container.current = div;
      render(div);
    },
    [render]
  );

  useEffect(() => {
    load()
      .catch(setError)
      .finally(() => toggleLoading(false));
  }, [toggleLoading, data]);

  return (
    <NodeViewWrapper className={cls(styles.wrap, isActive && styles.isActive)}>
      <Resizeable isEditable={isEditable} width={width} height={height} maxWidth={maxWidth} onChangeEnd={onResize}>
        <div
          className={cls(styles.renderWrap, 'render-wrapper')}
          style={{ ...INHERIT_SIZE_STYLE, overflow: 'hidden', backgroundColor: bgColor }}
        >
          {loading && (
            <div>
              <Spin spinning>
                {/* FIXME: semi-design 的问题，不加 div，文字会换行! */}
                <div></div>
              </Spin>
            </div>
          )}
          {error && <Text>{(error && error.message) || '未知错误'}</Text>}
          {!loading && !error && <div style={{ maxHeight: '100%' }} ref={setMxgraph}></div>}
        </div>

        <div className={styles.toolbarWrap}>
          <Space spacing={2}>
            <Button
              type="tertiary"
              theme="borderless"
              size="small"
              onClick={center}
              icon={<IconMindCenter style={ICON_STYLE} />}
            />

            <Button
              type="tertiary"
              theme="borderless"
              size="small"
              onClick={zoomOut}
              icon={<IconZoomOut style={ICON_STYLE} />}
            />

            <Button
              type="tertiary"
              theme="borderless"
              size="small"
              onClick={zoomIn}
              icon={<IconZoomIn style={ICON_STYLE} />}
            />
          </Space>
        </div>
      </Resizeable>
    </NodeViewWrapper>
  );
};