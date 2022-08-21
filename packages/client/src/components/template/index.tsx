import { IconClose } from '@douyinfe/semi-icons';
import { Button, Divider, Input, Modal, Space, TabPane, Tabs, Typography } from '@douyinfe/semi-ui';
import { useToggle } from 'hooks/use-toggle';
import React from 'react';

interface IProps {
  children?: React.ReactChild;
}

const Template: React.FC<IProps> = ({ children }) => {
  const [visible, toggleVisible] = useToggle(false);
  const { Text } = Typography;
  return (
    <>
      <div onClick={toggleVisible}>{children}</div>
      <Modal header={null} footer={null} visible={visible} height={680} width="70%" bodyStyle={{ padding: 0 }}>
        <div className="flex mx-[-24px] h-full">
          <div className="flex-auto h-full">模板内容</div>
          <div className="h-full w-[250px] bg-[color:var(--semi-color-fill-0)] p-4">
            <Space className="flex">
              <Text className="text-lg flex-auto">模板中心</Text>
              <IconClose className="text-lg cursor-pointer" onClick={toggleVisible} />
            </Space>
            <Input placeholder="搜索" className="mt-4 border-none" />
            <Tabs
              type="line"
              defaultActiveKey="1"
              className="border-none"
              tabBarExtraContent={
                <Button theme="borderless" size="small">
                  使用模板
                </Button>
              }
            >
              <TabPane tab="公开" itemKey="1">
                模板列表
              </TabPane>
              <TabPane tab="个人" itemKey="2">
                模板列表
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Modal>
    </>
  );
};

export { Template };
