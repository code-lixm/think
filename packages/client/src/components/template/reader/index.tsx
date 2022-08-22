import { Spin } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { Seo } from 'components/seo';
import { useTemplate } from 'data/template';
import React from 'react';
import { ReaderEditor } from 'tiptap/editor';

interface IProps {
  templateId: string;
}

export const TemplateReader: React.FC<IProps> = ({ templateId }) => {
  const { data, loading, error } = useTemplate(templateId);

  return (
    <DataRender
      loading={loading}
      loadingContent={
        <div style={{ margin: 24 }}>
          <Spin />
        </div>
      }
      error={error}
      normalContent={() => {
        return (
          <div id="js-template-reader" className="h-full px-5 pb-5 light-scrollbar">
            <Seo title={data.title} />
            <ReaderEditor content={data.content} />
          </div>
        );
      }}
    />
  );
};
