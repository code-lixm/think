import { IconLink } from '@douyinfe/semi-icons';
import { Button, Dropdown, Input, Modal, Space, Toast, Typography } from '@douyinfe/semi-ui';
import { isPublicDocument } from '@think/domains';
import { useDocumentDetail } from 'data/document';
import { getDocumentShareURL } from 'helpers/url';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface IProps {
  documentId: string;
  disabled?: boolean;
  render?: (arg: { isPublic: boolean; disabled: boolean; toggleVisible: () => void }) => React.ReactNode;
}

const { Text } = Typography;

export const DocumentShare: React.FC<IProps> = ({ documentId, disabled = false, render }) => {
  const { isMobile } = IsOnMobile.useHook();
  const ref = useRef<HTMLInputElement>();
  const [visible, toggleVisible] = useToggle(false);
  const { data, loading, toggleStatus } = useDocumentDetail(documentId, { enabled: visible });
  const [sharePassword, setSharePassword] = useState('');
  const isPublic = useMemo(() => data && isPublicDocument(data.document.status), [data]);
  const shareUrl = useMemo(() => data && getDocumentShareURL(data.document.id), [data]);

  const copyable = useMemo(
    () => ({
      onCopy: () => Toast.success({ content: '文章链接已复制，快去分享给别人吧！' }),
      successTip: '已复制',
    }),
    []
  );

  const prevent = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const viewUrl = useCallback(() => {
    window.open(shareUrl, '_blank');
  }, [shareUrl]);

  const handleOk = useCallback(() => {
    toggleStatus({ sharePassword: isPublic ? '' : sharePassword });
  }, [isPublic, sharePassword, toggleStatus]);

  const content = useMemo(
    () => (
      <div
        style={{
          maxWidth: '96vw',
          overflow: 'auto',
        }}
        onClick={prevent}
      >
        {isPublic ? (
          <Text
            link={{ href: shareUrl }}
            ellipsis
            copyable={{
              ...copyable,
              content: sharePassword
                ? `文档链接：${shareUrl}，密码：${sharePassword}，注意密码安全！`
                : `文档链接：${shareUrl}，点击立即访问！`,
            }}
            icon={<IconLink />}
            style={{ width: 320 }}
            underline
          >
            {shareUrl}
          </Text>
        ) : (
          <Input
            ref={ref}
            maxLength={8}
            mode="password"
            placeholder="您可以直接分享或者设置访问密码（最长8位）"
            value={sharePassword}
            onChange={setSharePassword}
          ></Input>
        )}
        <div style={{ marginTop: 16 }}>
          <Text type="warning">
            {isPublic
              ? '注意：分享开启后，页面包含的所有内容均可访问!'
              : '注意：分享关闭后，非协作成员将不能继续访问该页面！'}
          </Text>
        </div>
        <Space style={{ width: '100%', justifyContent: 'end', marginTop: '12px' }}>
          <Button onClick={() => toggleVisible(false)}>取消</Button>
          <Button theme="solid" type={isPublic ? 'danger' : 'primary'} onClick={handleOk}>
            {isPublic ? '关闭分享' : '开启分享'}
          </Button>
          {isPublic && (
            <Button theme="solid" type="primary" onClick={viewUrl}>
              查看文档
            </Button>
          )}
        </Space>
      </div>
    ),
    [copyable, handleOk, isPublic, prevent, sharePassword, shareUrl, toggleVisible, viewUrl]
  );

  const btn = useMemo(
    () =>
      render ? (
        render({ isPublic, disabled, toggleVisible })
      ) : (
        <Button disabled={disabled} type="primary" theme="light" onClick={toggleVisible}>
          {isPublic ? '分享中' : '分享'}
        </Button>
      ),
    [disabled, isPublic, render, toggleVisible]
  );

  useEffect(() => {
    console.log('chufale');
    if (loading || !data) return;
    setSharePassword(data.document && data.document.sharePassword);
  }, [loading, data]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => ref.current?.focus(), 100);
    }
  }, [visible]);

  return (
    <>
      {isMobile ? (
        <>
          <Modal
            centered
            title="文档分享"
            visible={visible}
            footer={null}
            onCancel={toggleVisible}
            style={{ maxWidth: '96vw' }}
            zIndex={1067}
          >
            {content}
          </Modal>
          {btn}
        </>
      ) : (
        <Dropdown
          visible={visible}
          trigger="click"
          position="leftTop"
          stopPropagation
          onVisibleChange={toggleVisible}
          render={
            <div
              style={{
                width: 412,
                maxWidth: '96vw',
                padding: '24px',
              }}
            >
              {content}
            </div>
          }
        >
          {btn}
        </Dropdown>
      )}
    </>
  );
};
