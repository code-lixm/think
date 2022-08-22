import { IconClose } from '@douyinfe/semi-icons';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { Button, Empty, Input, List, Modal, Space, Spin, TabPane, Tabs, Typography } from '@douyinfe/semi-ui';
import { useOwnTemplates, usePublicTemplates } from 'data/template';
import { useToggle } from 'hooks/use-toggle';
import Router from 'next/router';
import React, { useCallback, useState } from 'react';

import { TemplateList } from './list';
import { TemplateReader } from './reader';

const { Text } = Typography;
interface IProps {
  children?: React.ReactChild;
}

const Template: React.FC<IProps> = ({ children }) => {
  const { addTemplate } = useOwnTemplates();
  const [templateSearchText, setTemplateSearchText] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [visible, toggleVisible] = useToggle(false);

  const handleAdd = useCallback(() => {
    toggleVisible(false);
    addTemplate({ title: '未命名模板' }).then((res) => {
      Router.push(`/template/${res.id}`);
    });
  }, [addTemplate, toggleVisible]);

  const handleUseTemplate = useCallback(() => {
    toggleVisible(false);
  }, [toggleVisible]);

  return (
    <>
      <div onClick={toggleVisible}>{children}</div>
      <Modal
        centered
        header={null}
        footer={null}
        closeOnEsc
        height="680px"
        width="80%"
        visible={visible}
        bodyStyle={{ padding: 0 }}
        onCancel={toggleVisible}
      >
        <div className="flex mx-[-24px] h-full">
          <div className="flex-auto h-full relative">
            {templateId ? (
              <TemplateReader templateId={templateId} />
            ) : (
              <Empty
                className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
                image={<IllustrationConstruction style={{ width: 150, height: 150 }} />}
                darkModeImage={<IllustrationConstructionDark style={{ width: 150, height: 150 }} />}
                description="请选择一个模板查看哦~"
              />
            )}
          </div>
          <div className="h-full w-[250px] bg-[color:var(--semi-color-fill-0)] p-4">
            <div className="flex items-center">
              <Text className="text-md flex-auto">模板中心</Text>
              <IconClose
                className="text-md cursor-pointer p-1 rounded-sm hover:bg-[color:var(--semi-color-fill-2)]"
                onClick={toggleVisible}
              />
            </div>
            <Button block theme="solid" className="mt-4" onClick={handleUseTemplate} disabled={!templateId}>
              使用模板
            </Button>
            <Input
              showClear
              placeholder="搜索模板"
              className="mt-4 border-none"
              value={templateSearchText}
              onChange={setTemplateSearchText}
            />
            <Tabs
              type="line"
              defaultActiveKey="1"
              className="border-none"
              tabBarExtraContent={
                <Button theme="borderless" size="small" onClick={handleAdd}>
                  创建模板
                </Button>
              }
            >
              <TabPane tab="公开" itemKey="1">
                <TemplateList
                  type="public"
                  hook={usePublicTemplates}
                  templateSearchText={templateSearchText}
                  templateId={templateId}
                  setTemplateId={setTemplateId}
                />
              </TabPane>
              <TabPane tab="个人" itemKey="2">
                <TemplateList
                  type="person"
                  hook={useOwnTemplates}
                  templateSearchText={templateSearchText}
                  templateId={templateId}
                  setTemplateId={setTemplateId}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Modal>
    </>
  );
};

export { Template };
