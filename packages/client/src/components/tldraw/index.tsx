import { Tldraw, TldrawProps, useFileSystem } from '@tldraw/tldraw';

const TldrawEditor = (props: Partial<TldrawProps>) => {
  const fileSystemEvents = useFileSystem();

  return <Tldraw autofocus {...fileSystemEvents} {...props} />;
};

export default TldrawEditor;
