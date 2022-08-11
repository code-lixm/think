import { Nav } from '@douyinfe/semi-ui';
import { IconFolder } from 'components/icons/IconFolder';
import { IconHome } from 'components/icons/IconHome';
import { IconStar } from 'components/icons/IconStar';
import { IconTrash } from 'components/icons/IconTrash';
import Router, { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './index.module.scss';

export const SiderNavigation = () => {
  const { pathname } = useRouter();
  const [selectedKeys, setSelectedKeys] = useState([pathname]);

  // const path = useMemo(() => {
  //   const pathMap = {
  //     home: '/',
  //     favorite: '/favorite',
  //   };
  //   return pathMap[selectedKeys[0]];
  // }, [selectedKeys]);

  // useEffect(() => {
  //   setSelectedKeys(['home']);
  // }, [setSelectedKeys]);

  // useEffect(() => {
  //   Router.push({
  //     pathname: path,
  //   });
  // }, [path]);

  const onSelect = useCallback((item) => {
    const [path] = item.selectedKeys;
    setSelectedKeys(item.selectedKeys);
    Router.push({
      pathname: path,
    });
  }, []);

  return (
    <div className={styles.navigation}>
      <Nav
        defaultSelectedKeys={['/']}
        defaultOpenKeys={['space-list']}
        selectedKeys={selectedKeys}
        style={{ height: 'calc(100vh - 60px)', overflow: 'hidden' }}
        items={[
          { itemKey: '/', text: '我的主页', icon: <IconHome style={{ fontSize: '18px' }} /> },
          { itemKey: '/favorite', text: '我的收藏', icon: <IconStar style={{ fontSize: '18px' }} /> },
          {
            itemKey: 'space-list',
            text: '我的空间',
            icon: <IconFolder style={{ fontSize: '18px' }} />,
            items: [
              { itemKey: 'space-1', text: '空间1' },
              { itemKey: 'space-2', text: '空间2' },
              { itemKey: 'space-3', text: '空间3' },
            ],
          },
          {
            itemKey: 'trash',
            text: '回收站',
            icon: <IconTrash style={{ fontSize: '18px' }} />,
          },
        ]}
        onSelect={onSelect}
        footer={{ collapseButton: true }}
      />
    </div>
  );
};
