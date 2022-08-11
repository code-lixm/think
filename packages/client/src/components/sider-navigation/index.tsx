import { Nav } from '@douyinfe/semi-ui';
import { IconFolder } from 'components/icons/IconFolder';
import { IconFolderFilled } from 'components/icons/IconFolderFilled';
import { IconHome } from 'components/icons/IconHome';
import { IconHomeFilled } from 'components/icons/IconHomeFilled';
import { IconStar } from 'components/icons/IconStar';
import { IconStarFilled } from 'components/icons/IconStarFilled';
import { IconTrash } from 'components/icons/IconTrash';
import { IconTrashFilled } from 'components/icons/IconTrashFilled';
import Router, { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './index.module.scss';

export const SiderNavigation = () => {
  const { pathname } = useRouter();
  const defaultSelectedKeys = [pathname];

  const Home = () => <IconHome style={{ fontSize: '18px' }} />;
  const HomeFilled = () => <IconHomeFilled style={{ fontSize: '18px' }} />;
  const MenuIconHome = pathname === '/' ? <HomeFilled /> : <Home />;

  const Star = () => <IconStar style={{ fontSize: '18px' }} />;
  const StarFilled = () => <IconStarFilled style={{ fontSize: '18px' }} />;
  const MenuIconStar = pathname === '/favorite' ? <StarFilled /> : <Star />;

  const Folder = () => <IconFolder style={{ fontSize: '18px' }} />;
  const FolderFilled = () => <IconFolderFilled style={{ fontSize: '18px' }} />;
  const MenuIconFolder = pathname.includes('/app') ? <FolderFilled /> : <Folder />;

  const Trash = () => <IconTrash style={{ fontSize: '18px' }} />;
  const TrashFilled = () => <IconTrashFilled style={{ fontSize: '18px' }} />;
  const MenuIconTrash = pathname === '/trash' ? <TrashFilled /> : <Trash />;

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
    Router.push({
      pathname: path,
    });
  }, []);

  return (
    <div className={styles.navigation}>
      <Nav
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={['space-list']}
        style={{ height: 'calc(100vh - 60px)', overflow: 'hidden' }}
        items={[
          { itemKey: '/', text: '我的主页', icon: MenuIconHome },
          { itemKey: '/favorite', text: '我的收藏', icon: MenuIconStar },
          {
            itemKey: '/app',
            text: '我的空间',
            icon: MenuIconFolder,
            items: [
              { itemKey: 'space-1', text: '空间1' },
              { itemKey: 'space-2', text: '空间2' },
              { itemKey: 'space-3', text: '空间3' },
            ],
          },
          {
            itemKey: '/trash',
            text: '回收站',
            icon: MenuIconTrash,
          },
        ]}
        onSelect={onSelect}
        footer={{ collapseButton: true }}
      />
    </div>
  );
};
