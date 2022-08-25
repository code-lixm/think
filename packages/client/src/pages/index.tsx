import { IconChevronDown, IconPlus } from '@douyinfe/semi-icons';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { Dropdown, Empty, Layout, Space, Table, Typography } from '@douyinfe/semi-ui';
import { IDocument } from '@think/domains';
import { DataRender } from 'components/data-render';
import { DocumentActions } from 'components/document/actions';
import { IconCreateDoc } from 'components/icons/IconCreateDoc';
import { LocaleTime } from 'components/locale-time';
import { Seo } from 'components/seo';
import { Template } from 'components/template';
import { useRecentDocuments } from 'data/document';
import { toLogin, useUser } from 'data/user';
import { useRouterQuery } from 'hooks/use-router-query';
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

  const [key, setKey] = useState(1);
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
      <Layout className="h-full">
        <Content className="pt-[24px] px-[24px] flex flex-col light-scrollbar">
          <div className="flex mb-4 header">
            <Space spacing="loose" className="flex-auto">
              <Title
                heading={5}
                type={key === 1 ? 'primary' : 'quaternary'}
                onClick={() => setKey(1)}
                className="font-semibold cursor-pointer select-none"
              >
                最近编辑
              </Title>
              <Title
                heading={5}
                type={key === 2 ? 'primary' : 'quaternary'}
                onClick={() => setKey(2)}
                className="font-semibold cursor-pointer select-none"
              >
                最近浏览
              </Title>
            </Space>
            <Space className="justify-end flex-auto cursor-pointer" spacing="loose">
              <Dropdown
                trigger="hover"
                showTick
                render={
                  <Dropdown.Menu>
                    <Dropdown.Item active>所有</Dropdown.Item>
                    <Dropdown.Item>我的</Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <div className="flex items-center " style={{ justifyContent: 'end' }}>
                  <Text type="secondary" icon={<IconChevronDown />}>
                    归属
                  </Text>
                </div>
              </Dropdown>
              <Dropdown
                trigger="hover"
                showTick
                render={
                  <Dropdown.Menu>
                    <Dropdown.Item active>所有</Dropdown.Item>
                    <Dropdown.Item>我的</Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <div className="flex items-center" style={{ justifyContent: 'end' }}>
                  <Text type="secondary" icon={<IconChevronDown />}>
                    创建者
                  </Text>
                </div>
              </Dropdown>
            </Space>
          </div>
          <div className="relative flex-auto body">
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
        <Sider className="w-60 pt-[24px] pl-4">
          <Title heading={5} className="font-semibold">
            新建
          </Title>
          <Space className="w-full h-12 mt-4 text-center">
            <div className="h-full cursor-pointer">
              <IconCreateDoc style={{ fontSize: 28 }} />
              <Text className="block mt-1">文档</Text>
            </div>
          </Space>
          <Template>
            <button className="w-full my-4 px-3 py-1 border border-solid border-[color:rgb(var(--semi-grey-2))] hover:border-[color:rgb(var(--semi-color-primary))] rounded-md cursor-pointer bg-transparent">
              <Text>模板中心</Text>
            </button>
          </Template>
          <div className="flex items-center justify-between">
            <Title heading={5} className="flex-1 font-semibold">
              快捷入口
            </Title>
            <IconPlus className="cursor-pointer hover:bg-[color:var(--semi-color-fill-1)] p-1 rounded-sm" />
          </div>

          <Text type="quaternary" className="block mt-4 text-center">
            在这里
            <Text link className="px-[2px]">
              添加
            </Text>
            你的常用链接
          </Text>
        </Sider>
      </Layout>
    </SingleColumnLayout>
  );
};

export default Page;
