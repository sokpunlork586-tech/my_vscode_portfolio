import React from 'react';
import type { Metadata } from 'next';
import Diploma from '@/views/Diploma';
import baData from '@/data/json/ba.json';

const {
  metadata: { title, subtitle },
} = baData;

export const metadata: Metadata = {
  title: subtitle ? `${title}, ${subtitle}` : title,
};

export default function BaPage() {
  return <Diploma diplomaData={baData} />;
}
