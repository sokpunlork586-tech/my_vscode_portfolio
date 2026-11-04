import React from 'react';
import Link from 'next/link';
import Container from '@/components/Container';

export default function NotFound() {
  return (
    <Container>
      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h2 style={{ fontSize: '3rem', color: '#e06c75' }}>404 - File Not Found</h2>
        <p style={{ marginTop: '16px', color: '#abb2bf' }}>
          The requested path does not exist in this workspace.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '8px 16px',
            backgroundColor: '#21252b',
            color: '#42a5f5',
            borderRadius: '4px',
            border: '1px solid #333842',
          }}
        >
          Return to Workspace
        </Link>
      </div>
    </Container>
  );
}
