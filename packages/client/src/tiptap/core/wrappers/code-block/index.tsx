import { Button, Select, Tag, Typography } from '@douyinfe/semi-ui';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { copy } from 'helpers/copy';
import React, { useRef } from 'react';

import styles from './index.module.scss';

const { Text } = Typography;

export const CodeBlockWrapper = ({ editor, node: { attrs }, updateAttributes, extension }) => {
  const isEditable = editor.isEditable;
  const isPrint = editor?.options?.editorProps?.print;
  const { language: defaultLanguage } = attrs;
  const $container = useRef<HTMLPreElement>();

  return (
    <NodeViewWrapper className={cls(styles.wrap, !isPrint && styles.maxHeight, 'render-wrapper')}>
      <div className={styles.handleWrap}>
        {isEditable && (
          <Select
            size="small"
            defaultValue={defaultLanguage || 'null'}
            onChange={(value) => updateAttributes({ language: value })}
            className={styles.selectorWrap}
            disabled={!isEditable}
            filter
          >
            <Select.Option value="null">auto</Select.Option>
            {extension.options.lowlight.listLanguages().map((lang, index) => (
              <Select.Option key={index} value={lang}>
                {lang}
              </Select.Option>
            ))}
          </Select>
        )}
        {!isEditable && (
          <>
            <Button size="small" type="tertiary" theme="borderless">
              <Text style={{ fontWeight: 'normal' }}>{defaultLanguage || '默认格式'}</Text>
            </Button>
            <Button size="small" type="tertiary" theme="borderless" onClick={() => copy($container.current.innerText)}>
              <Text style={{ fontWeight: 'normal' }}>复制代码</Text>
            </Button>
          </>
        )}
      </div>
      <pre ref={$container} className={styles.pre}>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};
