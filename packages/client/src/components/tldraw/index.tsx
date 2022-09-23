import { TDDocument, Tldraw, TldrawApp, TldrawProps, useFileSystem } from '@tldraw/tldraw';
import { useCallback, useState } from 'react';

// import { useUploadAssets } from 'hooks/useUploadAssets';

// interface EditorProps {
//   id?: string;
// }

const Editor = (props: Partial<TldrawProps>) => {
  const fileSystemEvents = useFileSystem();

  // const { onAssetUpload } = useUploadAssets();

  return (
    <Tldraw
      autofocus
      // onMount={onMount}
      // onAssetUpload={onAssetUpload}
      {...fileSystemEvents}
      {...props}
    />
  );
};

export default Editor;
