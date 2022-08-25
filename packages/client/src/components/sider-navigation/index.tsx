import { Nav, Typography } from '@douyinfe/semi-ui';
import { IconHome } from 'components/icons/IconHome';
import { IconHomeFilled } from 'components/icons/IconHomeFilled';
import { IconStar } from 'components/icons/IconStar';
import { IconStarFilled } from 'components/icons/IconStarFilled';
import { IconTrash } from 'components/icons/IconTrash';
import { IconTrashFilled } from 'components/icons/IconTrashFilled';
import { IconUser } from 'components/icons/IconUser';
import { IconUserFilled } from 'components/icons/IconUserFilled';
import { IconUserGroup } from 'components/icons/IconUserGroup';
import { IconUserGroupFilled } from 'components/icons/IconUserGroupFilled';
import { IconUsers } from 'components/icons/IconUsers';
import { IconUsersFilled } from 'components/icons/IconUsersFilled';
import { useUserOrganizations } from 'data/organization';
import Router, { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
const { Text } = Typography;
export const SiderNavigation = () => {
  const { pathname } = useRouter();
  console.log('pathname: ', pathname.includes('/app'));

  const { data: userOrganizations } = useUserOrganizations();

  const Home = () => <IconHome style={{ fontSize: '18px' }} />;
  const HomeFilled = () => <IconHomeFilled style={{ fontSize: '18px' }} />;
  const MenuIconHome = useMemo(() => (pathname === '/' ? <HomeFilled /> : <Home />), [pathname]);

  const Star = () => <IconStar style={{ fontSize: '18px' }} />;
  const StarFilled = () => <IconStarFilled style={{ fontSize: '18px' }} />;
  const MenuIconStar = useMemo(() => (pathname === '/favorite' ? <StarFilled /> : <Star />), [pathname]);

  const User = () => <IconUser style={{ fontSize: '18px' }} />;
  const UserFilled = () => <IconUserFilled style={{ fontSize: '18px' }} />;
  const MenuIconUser = useMemo(() => (pathname.includes('/app') ? <User /> : <UserFilled />), [pathname]);

  const Users = () => <IconUsers style={{ fontSize: '18px' }} />;
  const UsersFilled = () => <IconUsersFilled style={{ fontSize: '18px' }} />;
  const MenuIconUsers = useMemo(() => (pathname.includes('/app') ? <Users /> : <UsersFilled />), [pathname]);

  const UserGroup = () => <IconUserGroup style={{ fontSize: '18px' }} />;
  const UserGroupFilled = () => <IconUserGroupFilled style={{ fontSize: '18px' }} />;
  const MenuIconUserGroup = useMemo(
    () => (pathname.includes('/app') ? <UserGroupFilled /> : <UserGroup />),
    [pathname]
  );

  const Trash = () => <IconTrash style={{ fontSize: '18px' }} />;
  const TrashFilled = () => <IconTrashFilled style={{ fontSize: '18px' }} />;
  const MenuIconTrash = useMemo(() => (pathname === '/trash' ? <TrashFilled /> : <Trash />), [pathname]);

  const organizations = useMemo(() => {
    return [
      {
        itemKey: '/app',
        text: '列表',
      },
      ...Array.from(userOrganizations || [], (item) => {
        return {
          itemKey: item.id,
          text: item.name,
        };
      }),
    ];
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
          defaultOpenKeys={['/all-organization']}
          style={{ height: 'calc(100vh - 60px)', overflow: 'hidden' }}
          items={[
            { itemKey: '/', text: '主页', icon: MenuIconHome },
            { itemKey: '/favorite', text: '收藏', icon: MenuIconStar },
            {
              itemKey: '/all-organization',
              text: '组织',
              icon: MenuIconUserGroup,
              items: organizations,
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
  }, [MenuIconUserGroup, MenuIconHome, MenuIconStar, MenuIconTrash, organizations, pathname, onSelect]);
  return Sider;
};
