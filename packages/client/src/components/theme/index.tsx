import { Button, Dropdown, Typography } from '@douyinfe/semi-ui';
import { Theme as ThemeState, ThemeEnum } from 'hooks/use-theme';
import React, { useCallback } from 'react';

export const Theme = () => {
  const { userPrefer, toggle } = ThemeState.useHook();

  const { Text } = Typography;

  const setLight = useCallback(() => {
    toggle(ThemeEnum.light);
  }, [toggle]);

  const setDark = useCallback(() => {
    toggle(ThemeEnum.dark);
  }, [toggle]);

  const setSystem = useCallback(() => {
    toggle(ThemeEnum.system);
  }, [toggle]);

  return (
    <Dropdown
      position="rightBottom"
      stopPropagation
      showTick
      render={
        <Dropdown.Menu>
          <Dropdown.Item active={userPrefer === ThemeEnum.light} onClick={setLight}>
            浅色
          </Dropdown.Item>
          <Dropdown.Item active={userPrefer === ThemeEnum.dark} onClick={setDark}>
            深色
          </Dropdown.Item>
          <Dropdown.Item active={userPrefer === ThemeEnum.system} onClick={setSystem}>
            跟随系统
          </Dropdown.Item>
        </Dropdown.Menu>
      }
    >
      <Button theme="borderless" style={{ width: '100%', fontWeight: 'normal', height: '36px', lineHeight: '36px' }}>
        <Text>系统主题</Text>
      </Button>
    </Dropdown>
  );
};
