import { Divider, Layout, Radio, RadioGroup, Space, Table, Typography } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { DataRender } from 'components/data-render';
import { Seo } from 'components/seo';
import { toLogin, useUser } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import { SingleColumnLayout } from 'layouts/single-column';
import type { NextPage } from 'next';
import Router from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';

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

  const [key, setKey] = useState('1');
  // const columns = useMemo(() => {
  //   return [
  //     {title: '标题', dataIndex: 'name'},
  //     {title: ''}
  //   ]
  // },[])
  return (
    <SingleColumnLayout>
      <Seo title="主页" />
      <Layout>
        <Content className="mr-4">
          <Space spacing="loose">
            <Title heading={5} link={key === '1'} onClick={() => setKey('1')} className="cursor-pointer">
              最近编辑
            </Title>
            <Title heading={5} link={key === '2'} onClick={() => setKey('2')} className="cursor-pointer">
              最近浏览
            </Title>
          </Space>
          {/* <Table columns={columns} dataSource={dataSource} rowSelection={rowSelection} scroll={scroll} /> */}
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
