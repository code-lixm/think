import { IconCloudUploadStroked, IconPlus } from '@douyinfe/semi-icons';
import { IllustrationConstruction } from '@douyinfe/semi-illustrations';
import { Button, Divider, Empty, Layout, Radio, RadioGroup, Space, Table, Typography } from '@douyinfe/semi-ui';
import { IDocument } from '@think/domains';
import cls from 'classnames';
import { DataRender } from 'components/data-render';
import { DocumentActions } from 'components/document/actions';
import { LocaleTime } from 'components/locale-time';
import { Seo } from 'components/seo';
import { useRecentDocuments } from 'data/document';
import { toLogin, useUser } from 'data/user';
import { useRouterQuery } from 'hooks/use-router-query';
import { useToggle } from 'hooks/use-toggle';
import { SingleColumnLayout } from 'layouts/single-column';
import type { NextPage } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const { Title, Text } = Typography;
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
      { title: '阅读量', dataIndex: 'views', key: 'views', width: 100 },
      { title: '访问时间', dataIndex: 'visitedAt', key: 'visitedAt', render: (date) => <LocaleTime date={date} /> },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width: 80,
        render: (_, document) => (
          <DocumentActions
            organizationId={document.organizationId}
            wikiId={document.wikiId}
            documentId={document.id}
            onDelete={refresh}
            showCreateDocument
            hideDocumentVersion
            hideDocumentStyle
          />
        ),
      },
    ];
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);
  return (
    <SingleColumnLayout>
      <Seo title="主页" />
      <Layout>
        <Content className="mr-4">
          <Space spacing="loose">
            <Title
              heading={5}
              strong={false}
              type={key === '1' ? 'primary' : 'quaternary'}
              onClick={() => setKey('1')}
              className="cursor-pointer select-none"
            >
              所有
            </Title>
            <Title
              heading={5}
              strong={false}
              type={key === '2' ? 'primary' : 'quaternary'}
              onClick={() => setKey('2')}
              className="cursor-pointer select-none"
            >
              最近编辑
            </Title>
            <Title
              heading={5}
              strong={false}
              type={key === '3' ? 'primary' : 'quaternary'}
              onClick={() => setKey('3')}
              className="cursor-pointer select-none"
            >
              最近浏览
            </Title>
          </Space>
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
                  darkModeImage={<IconCloudUploadStroked style={{ width: 150, height: 150 }} />}
                  description={<Text size="small">您最近还有没编辑过文档哦~</Text>}
                />
              )
            }
          />
          <Table columns={columns} showHeader={false} />
        </Content>
        <Sider className="w-60 pl-4">
          <Title heading={5}>新建</Title>
          <button className="w-full mt-4 border px-4 py-2 rounded-md">
            <Text>模板中心</Text>
          </button>
          <Space className="my-4 w-full h-12">
            <div className="rounded-md w-1/4 h-full bg-slate-100"></div>
            <div className="rounded-md w-1/4 h-full bg-slate-100"></div>
            <div className="rounded-md w-1/4 h-full bg-slate-100"></div>
            <div className="rounded-md w-1/4 h-full bg-slate-100"></div>
          </Space>
          <div className="flex items-center justify-between">
            <Title heading={5} className="flex-1">
              快捷入口
            </Title>
            <IconPlus className="cursor-pointer" />
          </div>

          <Text type="quaternary" size="small" className="block text-center mt-4">
            在这里
            <Text link size="small">
              添加
            </Text>
            你的常用链接
          </Text>
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
