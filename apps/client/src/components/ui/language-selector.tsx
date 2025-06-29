import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/utils/utils';

interface Language {
  id: string;
  name: string;
  nativeName: string;
  flagEmoji: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  selected: string;
  onSelect: (id: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, selected, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(
    selected ? languages.findIndex(l => l.id === selected) : -1
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemHeight = 80;
  const height = 400;
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelectedIndex(selected ? languages.findIndex(l => l.id === selected) : -1);
  }, [selected, languages]);

  useEffect(() => {
    if (scrollRef.current && selectedIndex >= 0) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = selectedIndex * itemHeight;
        }
      }, 100);
    }
  }, [selectedIndex]);

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const handleScrollEnd = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const newIndex = Math.round(scrollTop / itemHeight);
      const targetScrollTop = newIndex * itemHeight;
      scrollRef.current.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
      if (newIndex !== selectedIndex && newIndex >= 0 && newIndex < languages.length) {
        setSelectedIndex(newIndex);
        onSelect(languages[newIndex].id);
      }
    }
    setIsScrolling(false);
  };

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(handleScrollEnd, 80);
  };

  const getItemOpacity = (index: number) => {
    let centerIndex = selectedIndex;
    if (isScrolling && scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      centerIndex = scrollTop / itemHeight;
    }
    const distance = Math.abs(index - centerIndex);
    if (distance < 0.5) return 1;
    if (distance < 1.5) return 0.7;
    if (distance < 2.5) return 0.4;
    return 0.15;
  };

  const getItemScale = (index: number) => {
    let centerIndex = selectedIndex;
    if (isScrolling && scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      centerIndex = scrollTop / itemHeight;
    }
    const distance = Math.abs(index - centerIndex);
    if (distance < 0.5) return 1;
    if (distance < 1.5) return 0.97;
    return 0.93;
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Picker Container */}
      <div className="relative" style={{ height }}>
        {/* Selection Indicator */}
        <div
          className="absolute left-0 right-0 bg-primary/10 bg-opacity-50 border-2 rounded-lg border-primary pointer-events-none z-10"
          style={{
            top: (height / 2) - (itemHeight / 2),
            height: itemHeight
          }}
        />
        {/* Scrollable Items */}
        <div
          ref={scrollRef}
          className="h-full overflow-y-scroll scrollbar-hide"
          onScroll={handleScroll}
          style={{
            paddingTop: (height / 2) - (itemHeight / 2),
            paddingBottom: (height / 2) - (itemHeight / 2),
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {languages.map((lang, index) => (
            <div
              key={lang.id}
              className={cn(
                'flex items-center justify-between px-6 transition-opacity duration-100 cursor-pointer',
                selectedIndex === index ? 'font-bold' : '',
              )}
              style={{
                height: itemHeight,
                opacity: getItemOpacity(index),
                transform: `scale(${getItemScale(index)})`,
                transition: isScrolling ? 'none' : 'transform 0.2s ease-out, opacity 0.1s ease-out'
              }}
              onClick={() => {
                setSelectedIndex(index);
                onSelect(lang.id);
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    top: index * itemHeight,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{lang.flagEmoji}</span>
                <div className="text-left">
                  <h4 className={cn('font-semibold', selectedIndex === index ? 'text-black' : 'text-gray-900')}>{lang.nativeName}</h4>
                  <p className={cn('text-sm', selectedIndex === index ? 'text-black/80' : 'text-gray-600')}>{lang.name}</p>
                </div>
              </div>
              <div className={cn(
                'w-6 h-6 border-2 rounded-full flex items-center justify-center',
                selectedIndex === index ? 'border-black' : 'border-gray-300'
              )}>
                <div className={cn(
                  'w-3 h-3 rounded-full',
                  selectedIndex === index ? 'bg-black' : 'bg-gray-900 hidden'
                )}></div>
              </div>
            </div>
          ))}
        </div>
        {/* Fade Gradients */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}; 