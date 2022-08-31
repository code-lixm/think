import { IconArticle, IconBranch, IconExport, IconHistory, IconMore, IconPlus, IconStar } from '@douyinfe/semi-icons';
import { Button, Dropdown, Space, Tooltip, Typography } from '@douyinfe/semi-ui';
import { ButtonProps } from '@douyinfe/semi-ui/button/Button';
import { IDocument, IOrganization, IWiki } from '@think/domains';
import cls from 'classnames';
import { DocumentCreator } from 'components/document/create';
import { DocumentDeletion } from 'components/document/delete';
import { DocumentExporter } from 'components/document/export';
import { DocumentLinkCopper } from 'components/document/link';
import { DocumentShare } from 'components/document/share';
import { DocumentStar } from 'components/document/star';
import { DocumentVersionTrigger } from 'components/document/version';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback } from 'react';

import styles from './index.module.scss';

interface IProps {
  organizationId: IOrganization['id'];
  wikiId: IWiki['id'];
  documentId: IDocument['id'];
  document?: IDocument;
  hoverVisible?: boolean;
  onStar?: () => void;
  onCreate?: () => void;
  onDelete?: () => void;
  onVisibleChange?: () => void;
  showCreateDocument?: boolean;
  size?: ButtonProps['size'];
  hideDocumentVersion?: boolean;
  hideDocumentStyle?: boolean;
}

const { Text } = Typography;

export const DocumentActions: React.FC<IProps> = ({
  organizationId,
  wikiId,
  documentId,
  hoverVisible,
  document,
  onStar,
  onCreate,
  onDelete,
  onVisibleChange,
  showCreateDocument,
  size = 'default',
  hideDocumentVersion = false,
  hideDocumentStyle = false,
}) => {
  const [popoverVisible, togglePopoverVisible] = useToggle(false);
  const [createVisible, toggleCreateVisible] = useToggle(false);

  const create = useCallback(() => {
    togglePopoverVisible(false);
    toggleCreateVisible(true);
  }, [togglePopoverVisible, toggleCreateVisible]);

  const wrappedOnDelete = useCallback(() => {
    togglePopoverVisible(false);
    onDelete && onDelete();
  }, [onDelete, togglePopoverVisible]);

  const wrapOnVisibleChange = useCallback(
    (visible) => {
      togglePopoverVisible(visible);
      onVisibleChange && onVisibleChange();
    },
    [onVisibleChange, togglePopoverVisible]
  );

  return (
    <>
      <Dropdown
        style={{ padding: 0 }}
        trigger="click"
        position="bottomLeft"
        visible={popoverVisible}
        onVisibleChange={wrapOnVisibleChange}
        onClickOutSide={togglePopoverVisible}
        render={
          <Dropdown.Menu style={{ minWidth: 120 }}>
            {showCreateDocument && (
              <Dropdown.Item onClick={create}>
                <Text>
                  <Space>
                    <IconPlus />
                    新建子文档
                  </Space>
                </Text>
              </Dropdown.Item>
            )}
            {/* 分享 */}
            <DocumentShare
              key="share"
              documentId={documentId}
              render={({ isPublic, toggleVisible }) => {
                return (
                  <Dropdown.Item onClick={toggleVisible}>
                    <Text>
                      <Space>
                        <IconBranch />
                        {isPublic ? '分享中' : '分享他人'}
                      </Space>
                    </Text>
                  </Dropdown.Item>
                );
              }}
            />
            {/* 收藏 */}
            <DocumentStar
              organizationId={organizationId}
              wikiId={wikiId}
              documentId={documentId}
              render={({ star, toggleStar, text }) => (
                <Dropdown.Item
                  onClick={() => {
                    toggleStar().then(onStar);
                  }}
                >
                  <Text>
                    <Space>
                      <IconStar
                        style={{
                          color: star ? 'rgba(var(--semi-amber-4), 1)' : 'rgba(var(--semi-grey-3), 1)',
                        }}
                      />
                      {text}
                    </Space>
                  </Text>
                </Dropdown.Item>
              )}
            />
            {/* 复制链接 */}
            <DocumentLinkCopper
              organizationId={organizationId}
              wikiId={wikiId}
              documentId={documentId}
              render={({ copy, children }) => {
                return (
                  <Dropdown.Item onClick={copy}>
                    <Text>{children}</Text>
                  </Dropdown.Item>
                );
              }}
            />
            {/* 历史记录 */}
            {!hideDocumentVersion && (
              <DocumentVersionTrigger
                key="version"
                documentId={documentId}
                render={({ onClick }) => {
                  return (
                    <Dropdown.Item
                      onClick={() => {
                        togglePopoverVisible(false);
                        onClick();
                      }}
                    >
                      <Text>
                        <Space>
                          <IconHistory />
                          历史记录
                        </Space>
                      </Text>
                    </Dropdown.Item>
                  );
                }}
              />
            )}

            {document && (
              <DocumentExporter
                document={document}
                render={({ toggleVisible }) => {
                  return (
                    <Dropdown.Item onClick={() => toggleVisible(true)}>
                      <Text>
                        <Space>
                          <IconExport />
                          文档导出
                        </Space>
                      </Text>
                    </Dropdown.Item>
                  );
                }}
              />
            )}

            <Dropdown.Divider />

            <DocumentDeletion
              wikiId={wikiId}
              documentId={documentId}
              onDelete={wrappedOnDelete}
              render={({ children }) => {
                return <Dropdown.Item>{children as any}</Dropdown.Item>;
              }}
            />
          </Dropdown.Menu>
        }
      >
        <span>
          <Tooltip content="更多" position="bottom" className="whitespace-nowrap">
            <Button
              type="tertiary"
              size={size}
              className={cls(hoverVisible && styles.hoverVisible, popoverVisible && styles.isActive)}
              theme={popoverVisible ? 'solid' : 'borderless'}
              icon={<IconMore />}
            />
          </Tooltip>
        </span>
      </Dropdown>
      {showCreateDocument && (
        <DocumentCreator
          wikiId={wikiId}
          parentDocumentId={documentId}
          visible={createVisible}
          toggleVisible={toggleCreateVisible}
          onCreate={onCreate}
        />
      )}
    </>
  );
};
