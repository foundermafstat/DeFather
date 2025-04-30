import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { type Guide, type GuideItem, ContentLevel } from '@/data/defatherGuideTypes';
import { 
  initialGuide, 
  updateGuideState,
  findTriggerInMessage,
  detectSection,
  getCurrentItem,
  getNextStepHints
} from '@/data/defatherGuide';

// Context type definitions
interface GuideContextType {
  guide: Guide;
  currentItem: GuideItem | null;
  nextHints: string[];
  unlockSection: (sectionId: string, itemId?: string) => void;
  processChatMessage: (message: string) => string | null;
  resetGuide: () => void;
}

// Reducer action types
type GuideAction = 
  | { type: 'UNLOCK_SECTION', payload: { sectionId: string, itemId?: string } }
  | { type: 'RESET_GUIDE' };

// Create context
const GuideContext = createContext<GuideContextType | undefined>(undefined);

// Reducer for managing guide state
function guideReducer(state: Guide, action: GuideAction): Guide {
  switch (action.type) {
    case 'UNLOCK_SECTION':
      return updateGuideState(
        state, 
        action.payload.sectionId, 
        action.payload.itemId
      );
    case 'RESET_GUIDE':
      return initialGuide;
    default:
      return state;
  }
}

// Map of section IDs to English section names
const sectionNamesMap: Record<string, string> = {
  'intro': 'Introduction to Rootstock and DeFi',
  'environment': 'Environment Setup',
  'smart-contracts': 'Smart Contracts',
  'frontend': 'Frontend Integration',
  'deployment': 'Deployment',
  'resources': 'Additional Resources'
};

// Context provider
export function GuideProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or use initial state
  const getInitialState = (): Guide => {
    const savedState = localStorage.getItem('defatherGuideState');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse saved guide state:', e);
        return initialGuide;
      }
    }
    return initialGuide;
  };

  const [guide, dispatch] = useReducer(guideReducer, getInitialState());
  const currentItem = getCurrentItem(guide);
  const nextHints = getNextStepHints(guide);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('defatherGuideState', JSON.stringify(guide));
  }, [guide]);

  // Function to unlock a section
  const unlockSection = (sectionId: string, itemId?: string) => {
    dispatch({ 
      type: 'UNLOCK_SECTION', 
      payload: { sectionId, itemId } 
    });
  };

  // Reset guide to initial state
  const resetGuide = () => {
    dispatch({ type: 'RESET_GUIDE' });
  };

  // Process messages from chat
  const processChatMessage = (message: string): string | null => {
    // Check for key phrases to unlock sections
    const detectedSection = detectSection(message);
    if (detectedSection) {
      // Map of actions to section IDs
      const actionToSectionMap: Record<string, string> = {
        'INIT_GUIDE': 'intro',
        'SHOW_INTRO': 'intro',
        'SHOW_ENVIRONMENT': 'environment',
        'SHOW_SMART_CONTRACTS': 'smart-contracts',
        'SHOW_FRONTEND': 'frontend',
        'SHOW_DEPLOYMENT': 'deployment',
        'SHOW_RESOURCES': 'resources'
      };

      const sectionId = actionToSectionMap[detectedSection];
      if (sectionId) {
        unlockSection(sectionId);
        // Use the English name from the map instead of the section title from data
        return `I've updated the interactive guide with information about the "${
          sectionNamesMap[sectionId] || sectionId
        }" section.`;
      }
    }

    // Check for triggers for specific items in all sections
    // Modification: Prioritize checking the current section's items first
    if (guide.currentSection) {
      const currentSection = guide.sections.find(s => s.id === guide.currentSection);
      if (currentSection) {
        const triggeredItem = findTriggerInMessage(message, currentSection.items);
        if (triggeredItem) {
          // If item is already unlocked, just switch to it without changing its state
          unlockSection(guide.currentSection, triggeredItem.id);
          return `I've updated the guide with information about "${triggeredItem.title}".`;
        }
      }
    }

    // If no match in current section, check all other sections
    for (const section of guide.sections) {
      // Skip the current section as we've already checked it
      if (section.id === guide.currentSection) continue;
      
      const triggeredItem = findTriggerInMessage(message, section.items);
      if (triggeredItem) {
        // If we find a trigger in another section, unlock that section and the item
        if (section.level === ContentLevel.LOCKED) {
          // Only unlock locked sections, don't change completed sections
          unlockSection(section.id, triggeredItem.id);
          // Use the English name from the map for section names
          return `I've updated the guide with a new section on "${
            sectionNamesMap[section.id] || section.title
          }" focused on "${triggeredItem.title}".`;
        }
        // If section is already unlocked, just switch to the item
        unlockSection(section.id, triggeredItem.id);
        return `I've updated the guide to show information about "${triggeredItem.title}".`;
      }
    }

    return null;
  };

  // Context value
  const value = {
    guide,
    currentItem,
    nextHints,
    unlockSection,
    processChatMessage,
    resetGuide
  };

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

// Hook for using the context
export function useGuide() {
  const context = useContext(GuideContext);
  if (context === undefined) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
}
