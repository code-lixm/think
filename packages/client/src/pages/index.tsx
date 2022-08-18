import { Divider, Layout, Radio, RadioGroup, Space, Typography } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { DataRender } from 'components/data-render';
import { Seo } from 'components/seo';
import { toLogin, useUser } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import { SingleColumnLayout } from 'layouts/single-column';
import type { NextPage } from 'next';
import Router from 'next/router';
import React, { useCallback } from 'react';

const { Title, Paragraph } = Typography;
const { Content, Sider } = Layout;

const Page: NextPage = () => {
  const { user } = useUser();

  const start = useCallback(() => {
    if (user) {
      Router.push(`/app`);
    } else {
      toLogin();
    }
  }, [user]);

  const [isActive, toggleIsActive] = useToggle(true);
  return (
    <SingleColumnLayout>
      <Seo title="主页" />
      <Layout className={styles.wrap}>
        <Content className="mr-4">
          <Space spacing="loose">
            <Title heading={5} link={isActive} onClick={() => toggleIsActive(false)} className="cursor-pointer">
              最近编辑
            </Title>
            <Title heading={5} link={!isActive} onClick={() => toggleIsActive(true)} className="cursor-pointer">
              最近浏览
            </Title>
          </Space>
        </Content>
        {/* style={{ width: 250, background: '#f2f3f4', borderRadius: 6, padding: 16 }} */}
        <Sider className="w-60 bg-slate-50 rounded-md p-4">
          <Title heading={5}>新建</Title>
          <Title heading={5}>快捷入口</Title>
        </Sider>
      </Layout>

      {/* <DataRender
      loading={loading}
      error={error}
      empty={!loading && !data.length}
      ></DataRender> */}
    </SingleColumnLayout>
  );
};

export default Page;
