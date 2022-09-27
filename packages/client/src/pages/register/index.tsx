import { Button, Col, Form, Row, Toast, Typography } from '@douyinfe/semi-ui';
import { useRegister, useSystemPublicConfig, useVerifyCode } from 'data/user';
import { isEmail } from 'helpers/validator';
import { useInterval } from 'hooks/use-interval';
import { useRouterQuery } from 'hooks/use-router-query';
import { useToggle } from 'hooks/use-toggle';
import { LoginLayout } from 'layouts/login';
import Link from 'next/link';
import Router from 'next/router';
import React, { useCallback, useState } from 'react';

import styles from './index.module.scss';

const { Title, Text } = Typography;

const Page = () => {
  const query = useRouterQuery();

  const [email, setEmail] = useState('');
  const [hasSendVerifyCode, toggleHasSendVerifyCode] = useToggle(false);
  const [countDown, setCountDown] = useState(0);
  const { register, loading } = useRegister();
  const { data: systemConfig } = useSystemPublicConfig();
  const { sendVerifyCode, loading: sendVerifyCodeLoading } = useVerifyCode();

  const onFormChange = useCallback((formState) => {
    const email = formState.values.email;

    if (isEmail(email)) {
      setEmail(email);
    } else {
      setEmail(null);
    }
  }, []);

  const { start, stop } = useInterval(() => {
    setCountDown((v) => {
      if (v - 1 <= 0) {
        stop();
        toggleHasSendVerifyCode(false);
        return 0;
      }
      return v - 1;
    });
  }, 1000);

  const onFinish = useCallback(
    async (values) => {
      await register(values);
      Router.push('/login', { query });
      Toast.success('注册成功，请登录');
    },
    [register, query]
  );

  const getVerifyCode = useCallback(() => {
    stop();
    sendVerifyCode({ email })
      .then(() => {
        Toast.success('请前往邮箱查收验证码');
        setCountDown(60);
        start();
        toggleHasSendVerifyCode(true);
      })
      .catch(() => {
        toggleHasSendVerifyCode(false);
      });
  }, [email, toggleHasSendVerifyCode, sendVerifyCode, start, stop]);

  return (
    <LoginLayout title="注册">
      <div className={styles.register}>
        <Title className="form-tips">注册您的云策账号</Title>
        <div style={{ marginBottom: '50px', marginTop: '8px' }}>
          <Text type="secondary">已有账户?</Text>
          <Link
            href={{
              pathname: '/login',
              query,
            }}
          >
            <Text link style={{ marginLeft: '8px' }}>
              立即登录
            </Text>
          </Link>
        </div>
        <Form className="form" initValues={{ name: '', password: '' }} onChange={onFormChange} onSubmit={onFinish}>
          <Form.Input
            noLabel
            field="name"
            label="账户"
            style={{ width: '100%' }}
            placeholder="输入账户名称"
            rules={[{ required: true, message: '请输入账户' }]}
          ></Form.Input>

          <Form.Input
            noLabel
            mode="password"
            field="password"
            label="密码"
            style={{ width: '100%' }}
            placeholder="输入用户密码"
            rules={[{ required: true, message: '请输入密码' }]}
          ></Form.Input>

          <Form.Input
            noLabel
            field="email"
            placeholder={'请输入邮箱'}
            rules={[
              {
                type: 'email',
                message: '请输入正确的邮箱地址!',
              },
              {
                required: true,
                message: '请输入邮箱地址!',
              },
            ]}
          />

          {systemConfig && systemConfig.enableEmailVerify ? (
            <Row gutter={8} style={{ paddingTop: 12 }}>
              <Col span={16}>
                <Form.Input
                  noLabel
                  fieldStyle={{ paddingTop: 0 }}
                  placeholder={'请输入验证码'}
                  field="verifyCode"
                  rules={[{ required: true, message: '请输入邮箱收到的验证码！' }]}
                />
              </Col>
              <Col span={8}>
                <Button
                  disabled={!email || countDown > 0}
                  loading={sendVerifyCodeLoading}
                  onClick={getVerifyCode}
                  block
                >
                  {hasSendVerifyCode ? countDown : '获取验证码'}
                </Button>
              </Col>
            </Row>
          ) : null}

          <Button
            htmlType="submit"
            type="primary"
            theme="solid"
            block
            loading={loading}
            style={{ height: '56px', borderRadius: '12px', fontSize: '18px', marginTop: '12px', letterSpacing: '10px' }}
          >
            注册
          </Button>
        </Form>
      </div>
    </LoginLayout>
  );
};

export default Page;
