import { TaskList as BuiltInTaskList } from '@tiptap/extension-task-list';
import { PARSE_HTML_PRIORITY_HIGHEST } from 'tiptap/core/constants';

export const TaskList = BuiltInTaskList.extend({
  parseHTML() {
    return [
      {
        tag: 'ul[data-type="${this.name}" class="task-list"]',
        priority: PARSE_HTML_PRIORITY_HIGHEST,
      },
    ];
  },
});
