import { Button, Form, Layout, Typography } from '@douyinfe/semi-ui';
import { useUser } from 'data/user';
import { useRouterQuery } from 'hooks/use-router-query';
import { useToggle } from 'hooks/use-toggle';
import { LoginLayout } from 'layouts/login';
import Link from 'next/link';
import React, { useCallback } from 'react';

import styles from './index.module.scss';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const Page = () => {
  const { login } = useUser();
  const query = useRouterQuery();
  const [loading, toggleLoading] = useToggle(false);

  const toLogin = useCallback(
    (data) => {
      toggleLoading(true);
      login(data)
        .then(() => {
          toggleLoading(false);
        })
        .catch(() => {
          toggleLoading(false);
        });
    },
    [login, toggleLoading]
  );

  return (
    <LoginLayout title="登录">
      <div className={styles.login}>
        <Title className="form-tips">登录您的云策账号</Title>
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

        <Form className="form" initValues={{ name: '', password: '' }} onSubmit={toLogin}>
          <Form.Input
            noLabel
            field="name"
            label="账户"
            size="large"
            placeholder="输入账户名称或邮箱"
            showClear
            rules={[{ required: true, message: '请输入账户或邮箱' }]}
          ></Form.Input>

          <Form.Input
            noLabel
            mode="password"
            field="password"
            label="密码"
            size="large"
            placeholder="输入用户密码"
            rules={[{ required: true, message: '请输入密码' }]}
          ></Form.Input>
          <Button
            htmlType="submit"
            type="primary"
            theme="solid"
            size="large"
            block
            loading={loading}
            style={{ height: '56px', borderRadius: '12px', fontSize: '18px', marginTop: '12px', letterSpacing: '10px' }}
          >
            登录
          </Button>
          <footer style={{ textAlign: 'right' }}>
            <Link
              href={{
                pathname: '/forgetPassword',
                query,
              }}
            >
              <Text type="tertiary" link>
                忘记密码？
              </Text>
            </Link>
          </footer>
        </Form>
      </div>
    </LoginLayout>
  );
};

export default Page;
