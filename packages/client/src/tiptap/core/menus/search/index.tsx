import { Button, Input, Popover, SideSheet, Space, Typography } from '@douyinfe/semi-ui';
import { IconSearchReplace } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect, useState } from 'react';
import { Editor } from 'tiptap/core';
import { ON_SEARCH_RESULTS, SearchNReplace } from 'tiptap/core/extensions/search';

const { Text } = Typography;

export const Search: React.FC<{ editor: Editor }> = ({ editor }) => {
  const { isMobile } = IsOnMobile.useHook();
  const [visible, toggleVisible] = useToggle(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [replaceValue, setReplaceValue] = useState('');

  const openModalOnMobile = useCallback(() => {
    if (!isMobile) return;
    toggleVisible(true);
  }, [isMobile, toggleVisible]);

  useEffect(() => {
    if (!visible) {
      setSearchValue('');
      setReplaceValue('');
      setCurrentIndex(-1);
      setResults([]);
    }
  }, [visible]);

  useEffect(() => {
    if (editor && editor.commands && editor.commands.setSearchTerm) {
      editor.commands.setSearchTerm(searchValue);
    }
  }, [searchValue, editor]);

  useEffect(() => {
    if (editor && editor.commands && editor.commands.setReplaceTerm) {
      editor.commands.setReplaceTerm(replaceValue);
    }
  }, [replaceValue, editor]);

  useEffect(() => {
    if (!editor) return;

    const searchExtension = editor.extensionManager.extensions.find((ext) => ext.name === SearchNReplace.name);

    if (!searchExtension) return;

    const listener = () => {
      const currentIndex = searchExtension ? searchExtension.options.currentIndex : -1;
      const results = searchExtension ? searchExtension.options.results : [];
      setCurrentIndex(currentIndex);
      setResults(results);
    };

    editor.eventEmitter && editor.eventEmitter.on(ON_SEARCH_RESULTS, listener);

    return () => {
      if (!searchExtension) return;
      editor.eventEmitter && editor.eventEmitter.off(ON_SEARCH_RESULTS, listener);
    };
  }, [editor]);

  const content = (
    <div style={{ padding: isMobile ? '24px 0' : 0 }}>
      <div style={{ marginBottom: 12 }}>
        <Text type="tertiary" style={{ display: 'block', marginBottom: 6 }}>
          查找
        </Text>
        <Input
          autofocus
          value={searchValue}
          onChange={setSearchValue}
          suffix={results.length ? `${currentIndex + 1}/${results.length}` : ''}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <Text type="tertiary" style={{ display: 'block', marginBottom: 6 }}>
          替换为
        </Text>
        <Input value={replaceValue} onChange={setReplaceValue} />
      </div>
      <div>
        <Space>
          <Button size="small" disabled={!results.length} onClick={editor.commands.replaceAll}>
            全部替换
          </Button>
          <Button size="small" disabled={!results.length} onClick={editor.commands.replace}>
            替换
          </Button>
          <Button size="small" disabled={!results.length} onClick={editor.commands.goToPrevSearchResult}>
            上一个
          </Button>
          <Button size="small" disabled={!results.length} onClick={editor.commands.goToNextSearchResult}>
            下一个
          </Button>
        </Space>
      </div>
    </div>
  );

  const btn = (
    <Tooltip content="查找替换">
      <Button theme={'borderless'} type="tertiary" icon={<IconSearchReplace />} onMouseDown={openModalOnMobile} />
    </Tooltip>
  );

  return (
    <span>
      {isMobile ? (
        <>
          <SideSheet
            headerStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
            placement="bottom"
            title={'查找替换'}
            visible={visible}
            onCancel={toggleVisible}
            height={280}
            mask={false}
          >
            {content}
          </SideSheet>
          {btn}
        </>
      ) : (
        <Popover
          showArrow
          zIndex={10000}
          trigger="click"
          position="bottomRight"
          visible={visible}
          onVisibleChange={toggleVisible}
          content={content}
        >
          <span>{btn}</span>
        </Popover>
      )}
    </span>
  );
};
