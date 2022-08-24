import { IconDelete, IconEdit, IconMore } from '@douyinfe/semi-icons';
import { IllustrationIdle, IllustrationIdleDark } from '@douyinfe/semi-illustrations';
import { Dropdown, Empty, List, Popconfirm, Space, Typography } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { DataRender } from 'components/data-render';
import { IconCreateDoc } from 'components/icons/IconCreateDoc';
import { deleteTemplate } from 'data/template';
import Router from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './index.module.scss';
interface IProps {
  type: string;
  hook: Function;
  templateId: string;
  setTemplateId: Function;
  templateSearchText: string;
}
const { Text } = Typography;

const PersonalListItem = ({ template, templateId, setTemplateId, handleDelete }) => {
  const handleEdit = useCallback((templateId) => {
    Router.push(`/template/${templateId}/`);
  }, []);
  return (
    <List.Item
      className={cls(
        'group px-1 py-1 cursor-pointer hover:[background-color:var(--semi-color-fill-1)] rounded-sm flex items-center',
        templateId === template.id && 'bg-[color:var(--semi-color-fill-1)]'
      )}
      onClick={() => setTemplateId(template.id)}
    >
      <IconCreateDoc style={{ width: 20 }} />
      <Text ellipsis={{ showTooltip: true }} className="flex-auto">
        {template.title}
      </Text>
      <Dropdown
        trigger="click"
        position="bottomRight"
        render={
          <Dropdown.Menu>
            <Dropdown.Item icon={<IconEdit />} onClick={() => handleEdit(template.id)}>
              编辑
            </Dropdown.Item>
            <Popconfirm
              position="leftBottom"
              style={{ width: 320 }}
              title="删除模板"
              content="模板删除后不可恢复，谨慎操作！"
              onConfirm={() => handleDelete(template.id)}
            >
              <Dropdown.Item icon={<IconDelete />} type="danger">
                删除
              </Dropdown.Item>
            </Popconfirm>
          </Dropdown.Menu>
        }
      >
        <IconMore
          size="small"
          className="p-1 hover:bg-[color:var(--semi-color-fill-2)] rounded-sm invisible group-hover:visible rotate-90"
        />
      </Dropdown>
    </List.Item>
  );
};

const PublicListItem = ({ template, templateId, setTemplateId }) => {
  return (
    <List.Item
      className={cls(
        'px-1 py-1 cursor-pointer bg[color:var(--semi-color-fill-1)] hover:[background-color:var(--semi-color-fill-1)] rounded-sm',
        templateId === template.id && 'bg-[color:var(--semi-color-fill-1)]'
      )}
      onClick={() => setTemplateId(template.id)}
    >
      <Space>
        <IconCreateDoc />
        <Typography.Text ellipsis={{ showTooltip: true }} className="w-full">
          {template.title}
        </Typography.Text>
      </Space>
    </List.Item>
  );
};

export const TemplateList: React.FC<IProps> = ({ type, hook, templateId, setTemplateId, templateSearchText }) => {
  const { data: res, loading, error, refresh } = hook();

  const list = useMemo(() => {
    const target = (res && res.data) || [];
    return target.filter((item) => item.title.includes(templateSearchText) || templateSearchText.includes(item.title));
  }, [res, templateSearchText]);

  const handleDelete = useCallback(
    (templateId) => {
      deleteTemplate(templateId).then(() => {
        refresh();
      });
    },
    [refresh]
  );

  useEffect(() => {
    if (list.length) {
      const [template] = list;
      const { id } = template;
      setTemplateId(id);
    } else {
      setTemplateId('');
    }
  }, [list, setTemplateId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <DataRender
      loading={loading}
      error={error}
      normalContent={() => (
        <>
          <List
            className={styles.personal}
            dataSource={list}
            renderItem={(template) => {
              return type === 'person' ? (
                <PersonalListItem
                  template={template}
                  templateId={templateId}
                  setTemplateId={setTemplateId}
                  handleDelete={handleDelete}
                />
              ) : (
                <PublicListItem template={template} templateId={templateId} setTemplateId={setTemplateId} />
              );
            }}
            emptyContent={
              <Empty
                className="mt-[50%]"
                image={<IllustrationIdle style={{ width: 150, height: 150 }} />}
                darkModeImage={<IllustrationIdleDark style={{ width: 150, height: 150 }} />}
                description={'暂无模板'}
              />
            }
          ></List>
        </>
      )}
    />
  );
};
