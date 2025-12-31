
'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Check, Palette, Text, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const colors = [
  { name: 'Orange', hsl: '12 56% 55%' },
  { name: 'Blue', hsl: '221 83% 53%' },
  { name: 'Green', hsl: '142 71% 45%' },
  { name: 'Rose', hsl: '346 77% 58%' },
  { name: 'Violet', hsl: '262 88% 58%' },
];

const fonts = [
    { name: 'Default', value: 'default', body: 'var(--font-pt-sans)', headline: 'var(--font-space-grotesk)' },
    { name: 'Inter', value: 'inter', body: 'var(--font-inter)', headline: 'var(--font-inter)' },
    { name: 'Rubik', value: 'rubik', body: 'var(--font-rubik)', headline: 'var(--font-rubik)' },
    { name: 'Roboto Mono', value: 'roboto-mono', body: 'var(--font-roboto-mono)', headline: 'var(--font-roboto-mono)' },
];

export function ThemeCustomizer() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [activeColor, setActiveColor] = useState(colors[0].hsl);
  const [activeFont, setActiveFont] = useState(fonts[0].value);
  
  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const storedColor = localStorage.getItem('theme-color');
    const storedFont = localStorage.getItem('theme-font');
    if (storedColor) {
      root.style.setProperty('--primary', storedColor);
      root.style.setProperty('--sidebar-primary', storedColor);
      root.style.setProperty('--sidebar-accent-foreground', storedColor);
      root.style.setProperty('--sidebar-ring', storedColor);
      setActiveColor(storedColor);
    }
    if (storedFont) {
      const font = fonts.find(f => f.value === storedFont);
      if (font) {
        root.style.setProperty('--font-body', font.body);
        root.style.setProperty('--font-headline', font.headline);
        setActiveFont(font.value);
      }
    }
  }, []);

  const handleColorChange = (colorHsl: string) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colorHsl);
    root.style.setProperty('--sidebar-primary', colorHsl);
    root.style.setProperty('--sidebar-accent-foreground', colorHsl);
    root.style.setProperty('--sidebar-ring', colorHsl);
    localStorage.setItem('theme-color', colorHsl);
    setActiveColor(colorHsl);
  };
  
  const handleFontChange = (fontValue: string) => {
      const font = fonts.find(f => f.value === fontValue);
      if (font) {
          const root = document.documentElement;
          root.style.setProperty('--font-body', font.body);
          root.style.setProperty('--font-headline', font.headline);
          localStorage.setItem('theme-font', fontValue);
          setActiveFont(fontValue);
      }
  };

  if (!mounted) {
    return null; // Don't render until mounted on client
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-medium">
          <Palette className="size-5" />
          Color
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <Button
              key={color.name}
              variant={'outline'}
              size="sm"
              onClick={() => handleColorChange(color.hsl)}
              className={cn('justify-start')}
              style={{ '--theme-primary': `hsl(${color.hsl})` } as React.CSSProperties}
            >
              <span
                className="mr-2 h-5 w-5 shrink-0 -translate-x-1 rounded-full"
                style={{ backgroundColor: `hsl(${color.hsl})` }}
              />
              {color.name}
              {activeColor === color.hsl && <Check className="ml-auto flex h-4 w-4" />}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
         <div className="flex items-center gap-2 font-medium">
           <Text className="size-5" />
           Font
         </div>
         <div className="flex flex-wrap gap-2">
           {fonts.map((font) => (
              <Button
                key={font.name}
                variant={'outline'}
                size="sm"
                onClick={() => handleFontChange(font.value)}
                className={cn(activeFont === font.value && 'border-2 border-primary')}
              >
               {font.name}
              </Button>
           ))}
         </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 font-medium">
          <Sun className="size-5" />
          Mode
        </div>
        <div className="flex gap-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('light')}
          >
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('dark')}
          >
            Dark
          </Button>
        </div>
      </div>
    </div>
  );
}
