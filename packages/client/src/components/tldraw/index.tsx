import { TDDocument, Tldraw, TldrawApp, TldrawProps, useFileSystem } from '@tldraw/tldraw';
import { useCallback, useState } from 'react';

// import { useUploadAssets } from 'hooks/useUploadAssets';

declare const window: Window & { app: TldrawApp };

interface EditorProps {
  id?: string;
}

const Editor = ({ id = 'tldraw', ...rest }: EditorProps & Partial<TldrawProps>) => {
  const onMount = useCallback((app: TldrawApp) => {
    window.app = app;
    app.setSetting('language', 'zh-ch');
    app.setSetting('dockPosition', 'left');
  }, []);
  const fileSystemEvents = useFileSystem();

  // const { onAssetUpload } = useUploadAssets();

  return (
    <Tldraw
      id="tldraw"
      autofocus
      onMount={onMount}
      // onAssetUpload={onAssetUpload}
      {...fileSystemEvents}
      {...rest}
    />
  );
};

export default Editor;
