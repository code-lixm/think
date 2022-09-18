import { Layout as SemiLayout } from '@douyinfe/semi-ui';
import { SiderNavigation } from 'components/sider-navigation';
import React from 'react';

import { RouterHeader } from '../router-header';

const { Sider, Content } = SemiLayout;

const style = {
  padding: '16px 24px',
  backgroundColor: 'var(--semi-color-bg-0)',
};

export const SingleColumnLayout: React.FC = ({ children }) => {
  return (
    <SemiLayout>
      <RouterHeader />
      <SemiLayout>
        <Sider>
          <SiderNavigation />
        </Sider>
        <Content style={style}>
          <div className="w-full h-full">{children}</div>
        </Content>
      </SemiLayout>
    </SemiLayout>
  );
};
