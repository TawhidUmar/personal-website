'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Code2 } from 'lucide-react';

interface DynamicIconProps {
  name?: string | null;
  fallbackKeyword?: string;
  className?: string;
  size?: number;
}

// Normalize a string into PascalCase: e.g. "brain-circuit" -> "BrainCircuit", "terminal" -> "Terminal"
function toPascalCase(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

// Smart keyword inference if icon name is not provided
function inferIconFromKeyword(keyword?: string): string {
  if (!keyword) return 'Code2';
  const k = keyword.toLowerCase();

  if (k.includes('python') || k.includes('terminal') || k.includes('bash') || k.includes('shell')) return 'Terminal';
  if (k.includes('javascript') || k.includes('typescript') || k.includes('js') || k.includes('ts')) return 'FileCode';
  if (k.includes('react') || k.includes('next') || k.includes('web') || k.includes('frontend')) return 'Globe';
  if (k.includes('numpy') || k.includes('math') || k.includes('calc') || k.includes('tensor')) return 'Binary';
  if (k.includes('pandas') || k.includes('sql') || k.includes('postgres') || k.includes('mysql') || k.includes('database')) return 'Database';
  if (k.includes('matplotlib') || k.includes('seaborn') || k.includes('chart') || k.includes('graph') || k.includes('viz')) return 'LineChart';
  if (k.includes('scikit') || k.includes('learn') || k.includes('torch') || k.includes('ai') || k.includes('ml') || k.includes('model')) return 'BrainCircuit';
  if (k.includes('cuda') || k.includes('triton') || k.includes('gpu') || k.includes('hardware')) return 'Cpu';
  if (k.includes('illustrator') || k.includes('vector') || k.includes('pen')) return 'PenTool';
  if (k.includes('photoshop') || k.includes('design') || k.includes('art') || k.includes('ui') || k.includes('ux')) return 'Palette';
  if (k.includes('premier') || k.includes('video') || k.includes('film') || k.includes('motion')) return 'Video';
  if (k.includes('figma') || k.includes('layout')) return 'Layout';
  if (k.includes('security') || k.includes('auth') || k.includes('shield') || k.includes('rust')) return 'Shield';
  if (k.includes('cloud') || k.includes('aws') || k.includes('docker') || k.includes('devops')) return 'Boxes';
  if (k.includes('latex') || k.includes('paper') || k.includes('writing') || k.includes('book')) return 'BookOpen';

  return 'Code2';
}

export function DynamicIcon({ name, fallbackKeyword, className, size = 16 }: DynamicIconProps) {
  // If icon is an image URL or SVG path
  if (name && (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('/') || name.startsWith('data:'))) {
    return (
      <img
        src={name}
        alt={fallbackKeyword || 'icon'}
        width={size}
        height={size}
        className={`inline-block object-contain ${className ?? ''}`}
      />
    );
  }

  // Attempt to resolve Lucide icon
  let candidateName = name ? toPascalCase(name) : '';
  let IconComponent = (LucideIcons as Record<string, unknown>)[candidateName] as React.ComponentType<{ size?: number; className?: string }> | undefined;

  // Fallback to keyword match if not found
  if (!IconComponent && fallbackKeyword) {
    const inferred = inferIconFromKeyword(fallbackKeyword);
    IconComponent = (LucideIcons as Record<string, unknown>)[inferred] as React.ComponentType<{ size?: number; className?: string }> | undefined;
  }

  // Final fallback
  if (!IconComponent || typeof IconComponent !== 'function' && typeof IconComponent !== 'object') {
    return <Code2 size={size} className={className} />;
  }

  const Rendered = IconComponent;
  return <Rendered size={size} className={className} />;
}
