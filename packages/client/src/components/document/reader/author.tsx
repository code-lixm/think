import { IconUser } from '@douyinfe/semi-icons';
import { Avatar, Space } from '@douyinfe/semi-ui';
import { IDocument } from '@think/domains';
import { LocaleTime } from 'components/locale-time';
import React from 'react';

interface IProps {
  document: IDocument;
}

const style = {
  borderTop: '1px solid var(--semi-color-border)',
  marginTop: '0.75em',
  paddingTop: 8,
  fontSize: 13,
  fontWeight: 'normal',
  color: 'var(--semi-color-text-0)',
};

export const Author: React.FC<IProps> = ({ document }) => {
  return (
    <div style={style}>
      <Space>
        <Avatar size="extra-small" src={document && document.createUser && document.createUser.avatar}>
          {document.createUser.name.charAt(0).toUpperCase()}
        </Avatar>
        <div>
          <p style={{ margin: 0 }}>
            {document && document.createUser && document.createUser.name}
            {' ⦁ '}
            <LocaleTime date={document && document.updatedAt} />
            更新
          </p>
          {/* <p style={{ margin: '8px 0 0' }}>
            最近更新日期：
            <LocaleTime date={document && document.updatedAt} />
            {' ⦁ '}阅读量：
            {document && document.views}
          </p> */}
        </div>
      </Space>
    </div>
  );
};
