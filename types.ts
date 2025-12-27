import React from 'react';

export interface SearchResult {
  markdownReport: string;
  sources: SourceItem[];
}

export interface SourceItem {
  title: string;
  uri: string;
  source?: string;
}

export interface TopicPreset {
  id: string;
  label: string;
  icon: React.ReactNode;
  query: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  CRAWLING = 'CRAWLING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}