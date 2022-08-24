import { Button, Layout as SemiLayout, Nav, Space, Typography } from '@douyinfe/semi-ui';
import { Message } from 'components/message';
import { OrganizationPublicSwitcher } from 'components/organization/public-switcher';
import { Template } from 'components/template';
import { User } from 'components/user';
import { useUser } from 'data/user';
import { IsOnMobile } from 'hooks/use-on-mobile';
import Router, { useRouter } from 'next/router';
import React, { useCallback } from 'react';

const { Header: SemiHeader } = SemiLayout;

const menus = [
  {
    itemKey: '/find',
    text: '广场',
    onClick: () => {
      Router.push({
        pathname: `/find`,
      });
    },
  },
  {
    itemKey: '/template',
    text: <Template>模板中心</Template>,
  },
];

export const RouterHeader: React.FC = () => {
  const { user } = useUser();
  const { pathname } = useRouter();
  const { isMobile } = IsOnMobile.useHook();

  const gotoApp = useCallback(() => {
    Router.push(`/app`);
  }, []);

  return (
    <SemiHeader>
      {isMobile ? (
        <Nav
          mode="horizontal"
          style={{ overflow: 'auto' }}
          header={
            <Space>
              <OrganizationPublicSwitcher />
            </Space>
          }
          footer={
            <Space>
              {/* {user && (
                <Button theme="solid" onClick={gotoApp}>
                  前往组织
                </Button>
              )} */}
              <User />
            </Space>
          }
        ></Nav>
      ) : (
        <Nav
          mode="horizontal"
          style={{ overflow: 'auto' }}
          header={
            <Space style={{ marginRight: 12 }}>
              <OrganizationPublicSwitcher />
            </Space>
          }
          selectedKeys={[pathname || '/']}
          items={menus}
          footer={
            <Space>
              {user && (
                <Button theme="solid" onClick={gotoApp}>
                  前往组织
                </Button>
              )}
              {user && <Message />}
              <User />
            </Space>
          }
        ></Nav>
      )}
    </SemiHeader>
  );
};
