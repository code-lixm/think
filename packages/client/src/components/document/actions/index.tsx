import { IconArticle, IconBranch, IconExport, IconHistory, IconMore, IconPlus, IconStar } from '@douyinfe/semi-icons';
import { Button, Dropdown, Space, Tooltip, Typography } from '@douyinfe/semi-ui';
import { ButtonProps } from '@douyinfe/semi-ui/button/Button';
import { IDocument, IOrganization, IWiki } from '@think/domains';
import cls from 'classnames';
import { DocumentCreator } from 'components/document/create';
import { DocumentDeletor } from 'components/document/delete';
import { DocumentExporter } from 'components/document/export';
import { DocumentLinkCopyer } from 'components/document/link';
import { DocumentShare } from 'components/document/share';
import { DocumentStar } from 'components/document/star';
import { DocumentStyle } from 'components/document/style';
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
        content={
          <Dropdown.Menu>
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
            <DocumentLinkCopyer
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
            {/* 文档排版 */}
            {!hideDocumentVersion && (
              <DocumentStyle
                key="style"
                render={({ onClick }) => {
                  return (
                    <Dropdown.Item onClick={onClick}>
                      <Text>
                        <Space>
                          <IconArticle />
                          文档排版
                        </Space>
                      </Text>
                    </Dropdown.Item>
                  );
                }}
              />
            )}
            {/* 文档导出 */}
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

            <DocumentDeletor
              wikiId={wikiId}
              documentId={documentId}
              onDelete={wrappedOnDelete}
              render={({ children }) => {
                return <Dropdown.Item>{children}</Dropdown.Item>;
              }}
            />
          </Dropdown.Menu>
        }
      >
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          type="tertiary"
          size={size}
          className={cls(hoverVisible && styles.hoverVisible, popoverVisible && styles.isActive)}
          theme={popoverVisible ? 'solid' : 'borderless'}
          icon={<IconMore />}
        />
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
