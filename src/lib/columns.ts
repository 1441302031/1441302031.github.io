import type { BlogPost } from './posts';

export interface BlogColumn {
  slug: string;
  name: string;
  description: string;
  accent: string;
  icon: string;
}

export const columns: BlogColumn[] = [
  {
    slug: 'unity-engine',
    name: 'Unity / 团结引擎',
    description: '引擎机制、渲染管线、项目结构与 Unity 工程实践。',
    accent: 'green',
    icon: 'engine',
  },
  {
    slug: 'performance',
    name: '性能优化',
    description: 'Profiler、内存、GPU、加载链路与稳定帧率的优化笔记。',
    accent: 'orange',
    icon: 'flame',
  },
  {
    slug: 'editor-tools',
    name: 'Editor 工具',
    description: '编辑器扩展、资源检查、构建脚本与工程效率工具。',
    accent: 'amber',
    icon: 'hammer',
  },
  {
    slug: 'ai-workflow',
    name: 'AI Workflow',
    description: 'AI 辅助开发、自动化协作、提示词与研发流程改造。',
    accent: 'purple',
    icon: 'spark',
  },
  {
    slug: 'graphics-shader',
    name: '图形学 / Shader',
    description: '图形学基础、Shader、渲染状态与画面调试方法。',
    accent: 'sky',
    icon: 'crystal',
  },
];

const fallbackColumn = columns[0];

export function getColumn(slug?: string): BlogColumn {
  return columns.find((column) => column.slug === slug) ?? fallbackColumn;
}

export function getPostsByColumn(posts: BlogPost[], columnSlug: string): BlogPost[] {
  return posts.filter((post) => post.data.column === columnSlug);
}

export function getColumnPostCount(posts: BlogPost[], columnSlug: string): number {
  return getPostsByColumn(posts, columnSlug).length;
}
