import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons';
import { Button, Layout as SemiLayout } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { throttle } from 'helpers/throttle';
import { useDraggableWidth } from 'hooks/use-draggable-width';
import React, { useMemo } from 'react';
import SplitPane from 'react-split-pane';

import { RouterHeader } from '../router-header';
import styles from './index.module.scss';

const { Sider, Content } = SemiLayout;

interface IProps {
  leftNode: React.ReactNode;
  rightNode: React.ReactNode;
}

export const DoubleColumnLayout: React.FC<IProps> = ({ leftNode, rightNode }) => {
  const { minWidth, maxWidth, width, isCollapsed, updateWidth, toggleCollapsed } = useDraggableWidth();
  const debounceUpdate = useMemo(() => throttle(updateWidth, 200), [updateWidth]);

  return (
    <SemiLayout className={styles.wrap}>
      <RouterHeader />
      <SemiLayout className={styles.contentWrap}>
        <SplitPane minSize={minWidth} maxSize={maxWidth} size={width} onChange={debounceUpdate}>
          <Sider style={{ width: '100%', height: '100%' }} className={styles.leftWrap}>
            <Button
              size="small"
              icon={isCollapsed ? <IconChevronRight /> : <IconChevronLeft />}
              className={cls(styles.collapseBtn, isCollapsed && styles.isCollapsed)}
              onClick={toggleCollapsed}
            />
            <div
              style={{
                opacity: isCollapsed ? 0 : 1,
              }}
              className={styles.leftContentWrap}
            >
              {leftNode}
            </div>
          </Sider>
          <Content className={styles.rightWrap}>{rightNode}</Content>
        </SplitPane>
      </SemiLayout>
    </SemiLayout>
  );
};
