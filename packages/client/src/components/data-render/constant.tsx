// import { IllustrationFailure, IllustrationFailureDark } from '@douyinfe/semi-illustrations';
import { Empty, Spin, Typography } from '@douyinfe/semi-ui';
// import { Empty } from 'illustrations/empty';
import React, { useMemo } from 'react';

const { Text } = Typography;

export const defaultLoading = <Spin />;

export const defaultRenderError = (error) => {
  // return (
  //   <Empty
  //     className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
  //     image={<IllustrationFailure className="w-[200px] h-[200px]" />}
  //     darkModeImage={<IllustrationFailureDark className="w-[200px] h-[200px]" />}
  //     description={<Text>{(error && error.message) || '加载失败'}</Text>}
  //   />
  // );
  return <Text>{(error && error.message) || '未知错误'}</Text>;
};

export const defaultEmpty = (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      position: 'relative',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  >
    <div>
      <Empty />
    </div>
    <Text type="tertiary">暂无数据</Text>
  </div>
);

export const Render: React.FC<{ fn: ((arg: unknown) => React.ReactNode) | React.ReactNode; args?: unknown[] }> = ({
  fn,
  args = [],
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const content = useMemo(() => (typeof fn === 'function' ? fn.apply(null, ...args) : fn), [args]);

  return <>{content}</>;
};
