import { Layout, Typography } from '@douyinfe/semi-ui';
import { LogoImage, LogoText } from 'components/logo';
import { Seo } from 'components/seo';
import React from 'react';

import styles from './index.module.scss';

const { Content } = Layout;
const { Title, Text } = Typography;

type IProps = {
  title?: string;
  children: React.ReactNode;
};
export const LoginLayout: React.FC<IProps> = ({ children, title }) => {
  return (
    <Layout className={styles.wrap}>
      {/* bg */}
      <Seo title={title} />
      {/* logo */}
      <Title className="logo">
        <LogoImage />
        <LogoText />
      </Title>
      {/* main */}
      <Content className="content-container">
        <div className="slogan">
          <img src="/bg.svg" />
        </div>
        <div className="form-container"> {children} </div>
      </Content>
    </Layout>
  );
};
