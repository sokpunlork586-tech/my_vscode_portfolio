'use client';

import React, { useState } from 'react';
import '@/theme/icons';
import { useServerInsertedHTML } from 'next/navigation';
import { JssProvider, SheetsRegistry } from 'react-jss';

function createDeterministicGenerateId() {
  let ruleCounter = 0;
  return function generateId(rule: any, sheet?: any) {
    ruleCounter += 1;
    const prefix = sheet?.options?.classNamePrefix || '';
    return `${prefix ? prefix + '-' : ''}${rule.key}-${ruleCounter}`;
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
