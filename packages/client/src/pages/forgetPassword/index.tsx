import { Layout, Modal, Typography } from '@douyinfe/semi-ui';
import { ResetPassword } from 'components/user/reset-password';
import { useRouterQuery } from 'hooks/use-router-query';
import { LoginLayout } from 'layouts/login';
import Link from 'next/link';
import Router from 'next/router';
import React, { useCallback } from 'react';

import styles from './index.module.scss';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const Page = () => {
  const query = useRouterQuery();

  const onResetSuccess = useCallback(() => {
    Modal.confirm({
      title: <Title heading={5}>密码修改成功</Title>,
      content: <Text>是否跳转至登录?</Text>,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        Router.push('/login', { query });
      },
    });
  }, [query]);

  return (
    <LoginLayout title="重置密码">
      <div className={styles.reset}>
        <Title className="form-tips">修改您的云策账密</Title>
        <div style={{ marginBottom: '50px', marginTop: '8px' }}>
          <Text type="secondary">没有账户?</Text>
          <Link
            href={{
              pathname: '/register',
              query,
            }}
          >
            <Text link style={{ marginLeft: '8px' }}>
              立即注册
            </Text>
          </Link>
        </div>
        <ResetPassword onSuccess={onResetSuccess} />
        <footer style={{ textAlign: 'right' }}>
          <Link
            href={{
              pathname: '/login',
              query,
            }}
          >
            <Text type="tertiary" link>
              去登陆
            </Text>
          </Link>
        </footer>
      </div>
    </LoginLayout>
  );
};

export default Page;
