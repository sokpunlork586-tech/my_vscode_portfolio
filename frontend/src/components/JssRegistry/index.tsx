'use client';

import React, { useState } from 'react';
import '@/theme/icons';
import { useServerInsertedHTML } from 'next/navigation';
import { JssProvider, SheetsRegistry } from 'react-jss';

function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(36);
}

function safeSerialize(obj: any, depth = 0): string {
  if (depth > 10) return '';
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object') return String(obj);
  try {
    const keys = Object.keys(obj).sort();
    let res = '{';
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      res += k + ':' + safeSerialize(obj[k], depth + 1) + ';';
    }
    return res + '}';
  } catch {
    return '';
  }
}

function createDeterministicGenerateId() {
  return function generateId(rule: any, sheet?: any) {
    const prefix = sheet?.options?.classNamePrefix || '';
    const styleHash = rule?.style ? hashString(safeSerialize(rule.style)) : '0';
    const cleanKey = (rule?.key || 'rule').replace(/[^a-zA-Z0-9_-]/g, '_');
    return `${prefix ? prefix + '-' : ''}${cleanKey}-${styleHash}`;
  };
}

export interface JssRegistryProps {
  children: React.ReactNode;
}

export default function JssRegistry({ children }: JssRegistryProps) {
  const [registry] = useState(() => new SheetsRegistry());
  const [generateId] = useState(() => createDeterministicGenerateId());

  useServerInsertedHTML(() => {
    const styles = registry.toString();
    registry.reset();
    if (!styles) return null;
    return (
      <style
        id="jss-server-side"
        key="jss-server-side"
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <JssProvider registry={registry} generateId={generateId}>
      {children}
    </JssProvider>
  );
}
