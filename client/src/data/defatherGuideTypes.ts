// Types for DeFather Guide

// Content access level types
export enum ContentLevel {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
  CURRENT = 'current',
  COMPLETED = 'completed'
}

// Guide item types
export interface GuideItem {
  id: string;
  title: string;
  description: string;
  content: string;
  level: ContentLevel;
  triggerPhrases: string[];
  codeExample?: string;
  links?: {
    text: string;
    url: string;
  }[];
}

// Guide section type
export interface GuideSection {
  id: string;
  title: string;
  items: GuideItem[];
  level: ContentLevel;
}

// Complete guide
export interface Guide {
  title: string;
  description: string;
  sections: GuideSection[];
  currentSection: string;
  currentItem: string;
}
