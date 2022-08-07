import { IconDesktop, IconMoon, IconSun } from '@douyinfe/semi-icons';
import { Button, Dropdown } from '@douyinfe/semi-ui';
import { Theme as ThemeState, ThemeEnum } from 'hooks/use-theme';
import React, { useCallback } from 'react';

export const Theme = () => {
  const { userPrefer, theme, toggle } = ThemeState.useHook();
  const Icon = theme === 'dark' ? IconMoon : IconSun;

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
      position="bottomRight"
      trigger="click"
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
      <Button icon={<Icon style={{ fontSize: 20 }} />} theme="borderless"></Button>
    </Dropdown>
  );
};
