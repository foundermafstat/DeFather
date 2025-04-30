import { useState, useEffect, useRef } from 'react';
import { useGuide } from '@/context/GuideContext';
import { ContentLevel, Guide } from '@/data/defatherGuideTypes';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/context/ChatContext';

// Компактная панель для разблокировки разделов
function MiniUnlocker({ guide, unlockSection, onUpdateComplete }: { 
  guide: Guide, 
  unlockSection: (sectionId: string, itemId?: string) => void,
  onUpdateComplete: () => void
}) {
  // Разблокировать следующий раздел
  const unlockNextSection = () => {
    const currentSectionIndex = guide.sections.findIndex(s => s.id === guide.currentSection);
    if (currentSectionIndex < guide.sections.length - 1) {
      const nextSection = guide.sections[currentSectionIndex + 1];
      unlockSection(nextSection.id);
      setTimeout(onUpdateComplete, 100);
    }
  };

  return (
    <div className="fixed bottom-6 right-26 bg-gray-800 bg-opacity-80 backdrop-blur-sm p-2 rounded-lg shadow-lg z-50 border border-gray-700">
      <button 
        type="button"
        onClick={unlockNextSection}
        className="px-2 py-1 bg-blue-600 text-white text-xs rounded flex items-center"
        title="Unlock Next Section"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
        <span>Unlock Next</span>
      </button>
    </div>
  );
}

export default function DeFatherGuide() {
  const { guide, currentItem, nextHints, unlockSection } = useGuide();
  const navigate = useNavigate();
  const { sendMessage } = useChat();
  const [activeTab, setActiveTab] = useState<string>(guide.currentItem);
  const [animatedSection, setAnimatedSection] = useState<string | null>(null);
  const [animatedItem, setAnimatedItem] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  
  // Ref for section scrolling
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Update active tab when current item changes
  useEffect(() => {
    if (guide.currentItem) {
      setActiveTab(guide.currentItem);
    }
  }, [guide.currentItem]);

  // Animation effect when section or item changes
  useEffect(() => {
    if (animatedSection) {
      setTimeout(() => setAnimatedSection(null), 1000);
    }
    if (animatedItem) {
      setTimeout(() => setAnimatedItem(null), 1000);
    }
  }, [animatedSection, animatedItem]);

  // Force re-render on guide updates
  useEffect(() => {
    console.log("Guide state updated:", guide);
  }, [guide]);

  // Helper для принудительного обновления компонента
  const triggerUpdate = () => {
    setForceUpdate(prev => prev + 1);
  };

  // Send hint to chat
  const sendHintToChat = (hint: string) => {
    // Remove the phrase "Ask about " from the hint
    const cleanHint = hint.replace('Ask about "', '').replace('" to', '');
    sendMessage(`Tell me about ${cleanHint}`);
  };

  // Scroll to section with animation
  const scrollToSection = (sectionId: string) => {
    // If section is locked, don't do anything
    const section = guide.sections.find(s => s.id === sectionId);
    if (section?.level === ContentLevel.LOCKED) {
      console.log(`Section ${sectionId} is locked`);
      return;
    }

    console.log(`Scrolling to section ${sectionId}`);

    // Unlock section if not current
    if (section && section.level !== ContentLevel.CURRENT) {
      console.log(`Unlocking section ${sectionId}`);
      unlockSection(sectionId);
      
      // Принудительное обновление после изменения состояния
      setTimeout(triggerUpdate, 100);
    }

    // Set animation trigger
    setAnimatedSection(sectionId);

    // Scroll to section with smooth animation
    const sectionElement = sectionRefs.current[sectionId];
    if (sectionElement) {
      sectionElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Open item in the current section
  const openItem = (itemId: string) => {
    if (!itemId) return;
    
    const currentSection = guide.sections.find(s => s.id === guide.currentSection);
    if (!currentSection) {
      console.log("No current section found");
      return;
    }
    
    const item = currentSection.items.find(i => i.id === itemId);
    if (!item) {
      console.log(`Item ${itemId} not found`);
      return;
    }
    
    if (item.level === ContentLevel.LOCKED) {
      console.log(`Item ${itemId} is locked`);
      return;
    }
    
    console.log(`Opening item ${itemId} in section ${guide.currentSection}`);
    
    // Unlock this item explicitly
    unlockSection(guide.currentSection, itemId);
    
    // Принудительное обновление
    setTimeout(triggerUpdate, 100);
    
    // Set local UI state
    setActiveTab(itemId);
    setAnimatedItem(itemId);
  };

  // Get next item in the current section or move to next section
  const getNextNavigation = () => {
    const currentSection = guide.sections.find(s => s.id === guide.currentSection);
    if (!currentSection) return { nextItem: null, nextSection: null };
    
    // Find current item index
    const currentItemIndex = currentSection.items.findIndex(item => item.id === activeTab);
    
    // Check if there's a next item in this section
    const nextItem = currentItemIndex < currentSection.items.length - 1 
      ? currentSection.items[currentItemIndex + 1] 
      : null;
    
    // Find next section
    const currentSectionIndex = guide.sections.findIndex(s => s.id === guide.currentSection);
    const nextSection = currentSectionIndex < guide.sections.length - 1 
      ? guide.sections[currentSectionIndex + 1] 
      : null;
    
    return { nextItem, nextSection };
  };

  // Navigation to next item or section
  const navigateNext = () => {
    const { nextItem, nextSection } = getNextNavigation();
    
    if (nextItem && nextItem.level !== ContentLevel.LOCKED) {
      // If there's a next unlocked item in current section, navigate to it
      openItem(nextItem.id);
    } else if (nextSection && nextSection.level !== ContentLevel.LOCKED) {
      // If there's a next unlocked section, navigate to it
      scrollToSection(nextSection.id);
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      <div className="rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">{guide.title}</h1>
        <p className="text-gray-300 mb-8">{guide.description}</p>

        {/* Guide Sections Navigation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Guide Sections</h2>
          <div className="flex flex-wrap gap-2">
            {guide.sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  section.level === ContentLevel.LOCKED
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : section.level === ContentLevel.CURRENT
                    ? 'bg-blue-600 text-white'
                    : section.level === ContentLevel.COMPLETED
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
                disabled={section.level === ContentLevel.LOCKED}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Sections Content with Refs */}
        {guide.sections.map((section) => (
          <div 
            key={section.id}
            ref={el => { sectionRefs.current[section.id] = el }}
            className={`mb-16 ${section.level === ContentLevel.LOCKED ? 'opacity-50' : ''}`}
          >
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
              {section.title} 
              <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-700">
                {section.level === ContentLevel.LOCKED ? 'Locked' : 
                 section.level === ContentLevel.CURRENT ? 'Current' : 'Completed'}
              </span>
            </h2>

            {section.id === guide.currentSection && (
              <>
                {/* Tabs with current section items */}
                <div className="border-b border-gray-700 mb-4">
                  <div className="flex overflow-x-auto pb-2 space-x-2">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openItem(item.id)}
                        className={`px-4 py-2 rounded-t-lg ${
                          activeTab === item.id
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                        } ${
                          item.level === ContentLevel.LOCKED
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                        disabled={item.level === ContentLevel.LOCKED}
                      >
                        {item.title}
                        <span className="ml-2 text-xs">
                          {item.level === ContentLevel.LOCKED ? '🔒' : 
                           item.id === guide.currentItem ? '📍' : '✓'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active tab content */}
                {section.items.find(item => item.id === activeTab)?.level !== ContentLevel.LOCKED && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    {currentItem && activeTab === currentItem.id ? (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{currentItem.title}</h3>
                        <p className="text-gray-300 mb-4">{currentItem.description}</p>
                        
                        {/* Rendering markdown content */}
                        <div 
                          className="prose prose-invert max-w-none mb-4" 
                          dangerouslySetInnerHTML={{ 
                            __html: currentItem.content
                              .replace(/^[ ]+/gm, '')  // Remove spaces at the beginning of lines
                              .replace(/^#{1,6}\s(.+)$/gm, '<h2 class="text-xl font-bold text-white mt-4 mb-2">$1</h2>') // Headers
                              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold text
                              .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
                              .replace(/`(.+?)`/g, '<code class="bg-gray-800 px-1 rounded">$1</code>') // Inline code
                              .replace(/```(.+?)```/gs, '<pre class="bg-gray-800 p-3 rounded overflow-x-auto"><code>$1</code></pre>') // Code blocks
                              .replace(/\n\n/g, '<br/>') // Line breaks
                              .replace(/\* (.+)/g, '<li>$1</li>') // List items
                          }} 
                        />

                        {/* Code examples */}
                        {currentItem.codeExample && (
                          <div className="my-4">
                            <h4 className="text-lg font-semibold text-white mb-2">Code Example</h4>
                            <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg overflow-x-auto">
                              <code>{currentItem.codeExample}</code>
                            </pre>
                          </div>
                        )}

                        {/* Useful links */}
                        {currentItem.links && currentItem.links.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-lg font-semibold text-white mb-2">Useful Links</h4>
                            <ul className="list-disc list-inside text-blue-400">
                              {currentItem.links.map((link, index) => (
                                <li key={`link-${index}`} className="mb-1">
                                  <a 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    {link.text}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                          {/* Get next item in section or next section */}
                          {(() => {
                            const { nextItem, nextSection } = getNextNavigation();
                            const canNavigateNext = (nextItem && nextItem.level !== ContentLevel.LOCKED) || 
                                                   (nextSection && nextSection.level !== ContentLevel.LOCKED);
                            
                            return (
                              <>
                                {/* Button 1: Explore this section more */}
                                {nextItem && nextItem.level !== ContentLevel.LOCKED && (
                                  <button
                                    type="button"
                                    onClick={() => openItem(nextItem.id)}
                                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                                  >
                                    <span>Next: {nextItem.title}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                )}

                                {/* Button 2: Continue to next section */}
                                {nextSection && nextSection.level !== ContentLevel.LOCKED && (
                                  <button
                                    type="button"
                                    onClick={() => scrollToSection(nextSection.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center ml-auto"
                                  >
                                    <span>Continue to {nextSection.title}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                  </button>
                                )}

                                {/* If no specific navigation is available but can navigate */}
                                {!nextItem && !nextSection && (
                                  <button
                                    type="button"
                                    onClick={navigateNext}
                                    className={`${canNavigateNext ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 cursor-not-allowed'} text-white px-4 py-2 rounded-lg transition-colors ml-auto`}
                                    disabled={!canNavigateNext}
                                  >
                                    Continue
                                  </button>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">Select an item or ask a question in the chat to continue the guide</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {/* Hints for next steps */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">What's Next?</h2>
          {nextHints.length > 0 ? (
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 mb-4">Ask about the following topics to continue the guide:</p>
              <div className="flex flex-wrap gap-2">
                {nextHints.map((hint, index) => (
                  <button
                    key={`hint-${index}`}
                    type="button"
                    onClick={() => sendHintToChat(hint)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-gray-300">You have completed all available guide sections!</p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Компактная панель разблокировки */}
      <MiniUnlocker 
        guide={guide}
        unlockSection={unlockSection}
        onUpdateComplete={triggerUpdate}
      />

      {/* Mini Navigation Map */}
      <div className="fixed bottom-6 right-6 bg-gray-800 bg-opacity-80 backdrop-blur-sm p-3 rounded-lg shadow-lg z-50 border border-gray-700">
        <div className="text-xs text-gray-300 mb-2 font-semibold">Guide Map</div>
        <div className="grid gap-1.5">
          {guide.sections.map((section) => (
            <div key={section.id} className="flex items-center">
              <button
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`w-2.5 h-2.5 rounded-full mr-2 transition-all duration-300 ${
                  animatedSection === section.id 
                    ? 'scale-150 bg-blue-400' 
                    : section.level === ContentLevel.LOCKED
                    ? 'bg-gray-600'
                    : section.level === ContentLevel.CURRENT
                    ? 'bg-blue-500'
                    : section.level === ContentLevel.COMPLETED
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`}
                aria-label={`Jump to ${section.title} section`}
                disabled={section.level === ContentLevel.LOCKED}
              />
              <span className="text-xs text-gray-300 truncate max-w-[100px]">{section.title}</span>
              
              {section.id === guide.currentSection && (
                <div className="ml-4 flex items-center gap-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openItem(item.id)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        animatedItem === item.id
                          ? 'scale-150 bg-blue-400'
                          : item.id === activeTab
                          ? 'bg-blue-500'
                          : item.level === ContentLevel.LOCKED
                          ? 'bg-gray-600'
                          : 'bg-gray-400'
                      }`}
                      aria-label={`Jump to ${item.title} item`}
                      disabled={item.level === ContentLevel.LOCKED}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
