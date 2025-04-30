import { Guide, GuideSection, GuideItem, ContentLevel } from './defatherGuideTypes';
import { initialGuideState } from './defatherGuideData';
import { advancedSections } from './defatherGuideData2';
import { finalSections } from './defatherGuideData3';

// Combining all guide sections
export const fullGuideData: Guide = {
  ...initialGuideState,
  sections: [
    ...initialGuideState.sections,
    ...advancedSections,
    ...finalSections
  ]
};

// Key phrases that can be used to activate different parts of the guide
export const keyPhrases = [
  {
    phrase: 'create defi application',
    action: 'INIT_GUIDE'
  },
  {
    phrase: 'rootstock',
    action: 'SHOW_INTRO'
  },
  {
    phrase: 'environment setup',
    action: 'SHOW_ENVIRONMENT'
  },
  {
    phrase: 'smart contracts',
    action: 'SHOW_SMART_CONTRACTS'
  },
  {
    phrase: 'frontend integration',
    action: 'SHOW_FRONTEND'
  },
  {
    phrase: 'deploy contracts',
    action: 'SHOW_DEPLOYMENT'
  },
  {
    phrase: 'additional resources',
    action: 'SHOW_RESOURCES'
  }
];

/**
 * Find trigger phrases in user message
 */
export function findTriggerInMessage(message: string, items: GuideItem[]): GuideItem | null {
  const lowerMessage = message.toLowerCase();
  
  for (const item of items) {
    for (const trigger of item.triggerPhrases) {
      if (lowerMessage.includes(trigger.toLowerCase())) {
        return item;
      }
    }
  }
  
  return null;
}

/**
 * Determine which section to show based on user message
 */
export function detectSection(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  for (const phrase of keyPhrases) {
    if (lowerMessage.includes(phrase.phrase)) {
      return phrase.action;
    }
  }
  
  return null;
}

/**
 * Update guide state when a new section is activated
 */
export function updateGuideState(guide: Guide, sectionId: string, itemId?: string): Guide {
  const updatedSections = guide.sections.map(section => {
    // If this is the section that needs to be unlocked
    if (section.id === sectionId) {
      return {
        ...section,
        level: ContentLevel.CURRENT,
        items: section.items.map(item => {
          // If a specific item is specified, unlock only that one
          if (itemId && item.id === itemId) {
            return { ...item, level: ContentLevel.UNLOCKED };
          }
          // If no item is specified, unlock the first item in the section
          if (!itemId && item === section.items[0]) {
            return { ...item, level: ContentLevel.UNLOCKED };
          }
          return item;
        })
      };
    }
    
    // Update levels of other sections
    if (section.level === ContentLevel.CURRENT) {
      return { ...section, level: ContentLevel.COMPLETED };
    }
    
    return section;
  });
  
  // Find the ID of the first item in the new section if itemId is not specified
  const newItemId = itemId || updatedSections.find(s => s.id === sectionId)?.items[0]?.id || '';
  
  return {
    ...guide,
    sections: updatedSections,
    currentSection: sectionId,
    currentItem: newItemId
  };
}

/**
 * Get the current guide item
 */
export function getCurrentItem(guide: Guide): GuideItem | null {
  const currentSection = guide.sections.find(section => section.id === guide.currentSection);
  if (!currentSection) return null;
  
  return currentSection.items.find(item => item.id === guide.currentItem) || null;
}

/**
 * Get all unlocked guide items
 */
export function getUnlockedItems(guide: Guide): GuideItem[] {
  const unlockedItems: GuideItem[] = [];
  
  guide.sections.forEach(section => {
    section.items.forEach(item => {
      if (item.level !== ContentLevel.LOCKED) {
        unlockedItems.push(item);
      }
    });
  });
  
  return unlockedItems;
}

/**
 * Generate hints for next steps
 */
export function getNextStepHints(guide: Guide): string[] {
  const currentSection = guide.sections.find(section => section.id === guide.currentSection);
  if (!currentSection) return [];
  
  const nextSectionIndex = guide.sections.findIndex(section => section.id === guide.currentSection) + 1;
  const nextSection = nextSectionIndex < guide.sections.length ? guide.sections[nextSectionIndex] : null;
  
  const hints = [];
  
  // Hints for next items in the current section
  const currentItemIndex = currentSection.items.findIndex(item => item.id === guide.currentItem);
  const nextItemInSection = currentItemIndex < currentSection.items.length - 1 
    ? currentSection.items[currentItemIndex + 1] 
    : null;
  
  if (nextItemInSection) {
    hints.push(`Ask about "${nextItemInSection.title}" to continue.`);
  }
  
  // Hints for the next section
  if (nextSection) {
    hints.push(`Ask about "${nextSection.title}" to move to the next section.`);
  }
  
  return hints;
}

// Export initial guide state
export const initialGuide = fullGuideData;
