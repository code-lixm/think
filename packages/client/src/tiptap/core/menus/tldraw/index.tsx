import React from 'react';
import { Editor } from 'tiptap/core';

import { TldrawBubbleMenu } from './bubble';
import { TldrawSettingModal } from './modal';

export const Tldraw: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <TldrawBubbleMenu editor={editor} />
      <TldrawSettingModal editor={editor} />
    </>
  );
};
