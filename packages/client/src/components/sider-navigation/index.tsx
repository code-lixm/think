import { Nav, Tag, Tooltip, Typography } from '@douyinfe/semi-ui';
import { IconFolder } from 'components/icons/IconFolder';
import { IconFolderFilled } from 'components/icons/IconFolderFilled';
import { IconHome } from 'components/icons/IconHome';
import { IconHomeFilled } from 'components/icons/IconHomeFilled';
import { IconStar } from 'components/icons/IconStar';
import { IconStarFilled } from 'components/icons/IconStarFilled';
import { IconTrash } from 'components/icons/IconTrash';
import { IconTrashFilled } from 'components/icons/IconTrashFilled';
import { useUserOrganizations } from 'data/organization';
import Router, { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
const { Text } = Typography;
export const SiderNavigation = () => {
  const { pathname } = useRouter();

  const { data: userOrganizations } = useUserOrganizations();

  const Home = () => <IconHome style={{ fontSize: '18px' }} />;
  const HomeFilled = () => <IconHomeFilled style={{ fontSize: '18px' }} />;
  const MenuIconHome = useMemo(() => (pathname === '/' ? <HomeFilled /> : <Home />), [pathname]);

  const Star = () => <IconStar style={{ fontSize: '18px' }} />;
  const StarFilled = () => <IconStarFilled style={{ fontSize: '18px' }} />;
  const MenuIconStar = useMemo(() => (pathname === '/favorite' ? <StarFilled /> : <Star />), [pathname]);

  const Folder = () => <IconFolder style={{ fontSize: '18px' }} />;
  const FolderFilled = () => <IconFolderFilled style={{ fontSize: '18px' }} />;
  const MenuIconFolder = useMemo(() => (pathname.includes('/app') ? <FolderFilled /> : <Folder />), [pathname]);

  const Trash = () => <IconTrash style={{ fontSize: '18px' }} />;
  const TrashFilled = () => <IconTrashFilled style={{ fontSize: '18px' }} />;
  const MenuIconTrash = useMemo(() => (pathname === '/trash' ? <TrashFilled /> : <Trash />), [pathname]);

  const organizations = useMemo(() => {
    return Array.from(userOrganizations || [], (item) => {
      return {
        itemKey: item.id,
        text: item.name,
        isPersonal: item.isPersonal,
      };
    });
  }, [userOrganizations]);

  const onSelect = useCallback((item) => {
    const [path] = item.selectedKeys;
    Router.push({
      pathname: path,
    });
  }, []);

  const Sider = useMemo(() => {
    return (
      <div className="w-full">
        <Nav
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={['space-list']}
          style={{ height: 'calc(100vh - 60px)', overflow: 'hidden' }}
          items={[
            { itemKey: '/', text: '主页', icon: MenuIconHome },
            { itemKey: '/favorite', text: '收藏', icon: MenuIconStar },
            {
              itemKey: '/app',
              text: '我的组织',
              icon: MenuIconFolder,
            },
            ...organizations,
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
  }, [MenuIconHome, MenuIconStar, MenuIconFolder, MenuIconTrash, organizations, pathname, onSelect]);
  return Sider;
};
