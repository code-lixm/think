import { IconCloudUploadStroked, IconSearch } from '@douyinfe/semi-icons';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { Button, Empty, Input, Layout, Space, Table, Typography } from '@douyinfe/semi-ui';
import { IDocument } from '@think/domains';
import cls from 'classnames';
import { DataRender } from 'components/data-render';
import { LocaleTime } from 'components/locale-time';
import { Seo } from 'components/seo';
import { useRecentDocuments } from 'data/document';
import { toLogin, useUser } from 'data/user';
import { useRouterQuery } from 'hooks/use-router-query';
import { SingleColumnLayout } from 'layouts/single-column';
import type { NextPage } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';

const { Title, Text } = Typography;
const { Content } = Layout;

const Page: NextPage = () => {
  const { user } = useUser();

  const start = useCallback(() => {
    if (user) {
      Router.push(`/app`);
    } else {
      toLogin();
    }
  }, [user]);

  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { data, error, loading, refresh } = useRecentDocuments(organizationId);
  const columns = useMemo(() => {
    return [
      {
        title: '标题',
        dataIndex: 'name',
        key: 'title',
        width: 200,
        render: (_, document: IDocument) => {
          return (
            <Link
              href={{
                pathname: `/app/org/[organizationId]/wiki/[wikiId]/doc/[documentId]`,
                query: { organizationId: document.organizationId, wikiId: document.wikiId, documentId: document.id },
              }}
            >
              <a style={{ color: 'inherit', textDecoration: 'none' }}>{document.title}</a>
            </Link>
          );
        },
      },
      { title: '归属', dataIndex: 'views', key: 'views', width: 100 },
      { title: '删除时间', dataIndex: 'visitedAt', key: 'visitedAt', render: (date) => <LocaleTime date={date} /> },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width: 80,
        render: (_, document) => (
          <Space>
            <Button theme="borderless" type="primary" style={{ marginRight: 8 }}>
              恢复
            </Button>
            <Button theme="borderless" type="primary" style={{ marginRight: 8 }}>
              彻底删除
            </Button>
          </Space>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);
  return (
    <SingleColumnLayout>
      <Seo title="回收站" />
      <Layout className="h-full">
        <Content className="pt-[24px] px-[24px] flex flex-col">
          <div className="header flex mb-6 items-center justify-between">
            <Space spacing="loose" className="flex-auto">
              <Title heading={5} className="cursor-pointer select-none font-semibold">
                回收站
              </Title>
            </Space>
            <Input
              prefix={<IconSearch />}
              showClear
              placeholder="搜索"
              className="w-[200px] border-none bg-[color:var(--semi-color-fill-0)] hover:bg-[color:var(--semi-color-fill-0)]"
            />
          </div>
          <div className="body flex-auto relative">
            <DataRender
              loading={loading}
              loadingContent={
                <Table dataSource={[]} loading={true} pagination={false} size="small" style={{ marginTop: 16 }}>
                  {columns}
                </Table>
              }
              error={error}
              normalContent={() =>
                data && data.length ? (
                  <Table dataSource={data} loading={loading} pagination={false} size="small" style={{ marginTop: 16 }}>
                    {columns}
                  </Table>
                ) : (
                  <Empty
                    image={<IllustrationConstruction style={{ width: 150, height: 150 }} />}
                    darkModeImage={<IllustrationConstructionDark style={{ width: 150, height: 150 }} />}
                    description={<Text size="small">您最近还有没编辑过文档哦~</Text>}
                  />
                )
              }
            />
          </div>
        </Content>
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
