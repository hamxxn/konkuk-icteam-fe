'use client';

import { useId, useState } from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { Input } from '@konkuk-icteam-fe/design-system/ui';
import { getSchoolEmailSuggestions } from '../_utils/schoolEmail';

// 값은 이 칸이 다루므로 value·onChange·type은 받지 않고, 바뀐 메일을 onValueChange로 알린다.
// 그 밖의 속성(id, name, ref, hasError, aria-* 등)은 안쪽 Input에 그대로 넘긴다
type SchoolEmailInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type'
> & {
  value: string;
  onValueChange: (value: string) => void;
  ref?: React.Ref<HTMLInputElement>;
};

// 학교 메일 칸. 아이디만 입력해도 @konkuk.ac.kr을 붙인 메일을 후보로 띄운다.
// 디자인 시스템 ComboBox는 입력칸에 라벨 id·오류 표시·ref를 넘길 수 없어, Input에 후보 목록을 직접 붙인다
export default function SchoolEmailInput({
  value,
  onValueChange,
  onKeyDown,
  onBlur,
  className,
  ...props
}: SchoolEmailInputProps) {
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const suggestions = getSchoolEmailSuggestions(value);
  const isListOpen = isOpen && suggestions.length > 0;
  const activeIndex = Math.min(highlightedIndex, suggestions.length - 1);

  const handleSuggestionSelect = (suggestion: string) => {
    onValueChange(suggestion);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    // 한글 조합 중에 누른 키는 조합을 끝내는 키라 후보 고르기로 쓰지 않는다
    if (!isListOpen || event.nativeEvent.isComposing) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setHighlightedIndex((activeIndex + step + suggestions.length) % suggestions.length);
      return;
    }
    // 후보가 열려 있을 때 Enter는 폼 제출이 아니라 후보 고르기다
    if (event.key === 'Enter') {
      event.preventDefault();
      const suggestion = suggestions[activeIndex];
      if (suggestion) handleSuggestionSelect(suggestion);
      return;
    }
    if (event.key === 'Escape') setIsOpen(false);
  };

  return (
    // 펼친 목록이 아래 칸·버튼에 가려지지 않게 이 칸 전체를 위에 쌓는다
    <div className='relative z-10'>
      <Input
        {...props}
        type='email'
        role='combobox'
        aria-autocomplete='list'
        aria-expanded={isListOpen}
        aria-controls={listboxId}
        aria-activedescendant={isListOpen ? `${listboxId}-${activeIndex}` : undefined}
        value={value}
        className={className}
        onChange={(event) => {
          onValueChange(event.target.value);
          setIsOpen(true);
          setHighlightedIndex(0);
        }}
        onKeyDown={handleKeyDown}
        onBlur={(event) => {
          setIsOpen(false);
          onBlur?.(event);
        }}
      />
      {isListOpen && (
        <ul
          id={listboxId}
          role='listbox'
          className='bg-black-1 absolute top-[calc(100%+0.5rem)] left-0 w-full rounded-[0.4rem] p-[0.4rem] shadow-[0_0_12px_0_rgba(69,66,90,0.14)]'
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              id={`${listboxId}-${index}`}
              role='option'
              aria-selected={index === activeIndex}
              className={cn(
                'caption-14-md cursor-pointer rounded-[0.4rem] p-[1rem] hover:bg-gray-50',
                index === activeIndex && 'bg-gray-50',
              )}
              // 누르는 순간 입력칸 초점이 빠지면 목록이 먼저 닫히므로, 초점을 입력칸에 둔 채 고른다
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
