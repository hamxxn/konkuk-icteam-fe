'use client';

import { useRef, useState } from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import Input from '../base/Input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../base/command';
import useClickOutside from '../hooks/useClickOutside';

type ComboBoxProps = {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  inputClassName?: string;
  optionClassName?: string;
  optionWrapperClassName?: string;
  onBlur?: () => void;
  // 열리자마자 바로 입력할 수 있게 입력칸에 초점을 둔다
  autoFocus?: boolean;
  // 눈에 보이는 라벨이 없을 때 스크린리더가 읽을 입력칸 이름
  'aria-label'?: string;
};

export default function ComboBox({
  options,
  placeholder = '검색어를 입력해주세요',
  value,
  onChange,
  onBlur,
  inputClassName,
  optionClassName,
  optionWrapperClassName,
  autoFocus,
  'aria-label': ariaLabel,
}: ComboBoxProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledQuery, setUncontrolledQuery] = useState('');

  const query = isControlled ? value : uncontrolledQuery;

  // 방향키·Enter로 고를 항목. 입력칸이 cmdk 전용 입력이 아니라서 cmdk가 목록이 바뀔 때 강조를 다시 맞춰 주지 않는다.
  // 그래서 강조한 항목이 목록에서 사라지면 첫 항목을 강조한다
  const [highlightedOption, setHighlightedOption] = useState('');
  const activeOption = options.includes(highlightedOption) ? highlightedOption : (options[0] ?? '');

  const setQuery = (next: string) => {
    if (!isControlled) setUncontrolledQuery(next);
    onChange?.(next);
  };

  useClickOutside(rootRef, () => setIsOpen(false));

  const handleOptionSelect = (option: string) => {
    setQuery(option);
    setIsOpen(false);
  };

  // 한글처럼 조합 중인 글자에서 누른 Enter는 브라우저가 글자 확정에 먼저 쓰고, cmdk는 그 Enter를 무시한다.
  // 그래서 조합이 끝나 목록이 다시 그려진 뒤, 그때 강조된 항목을 직접 고른다
  const isEnterWhileComposingRef = useRef(false);

  const selectHighlightedOption = () => {
    requestAnimationFrame(() => {
      const highlighted = rootRef.current
        ?.querySelector('[cmdk-item][data-selected="true"]')
        ?.getAttribute('data-value');
      if (highlighted) handleOptionSelect(highlighted);
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    // 크롬: 조합 중에 Enter keydown이 먼저 오고, 그다음 조합이 끝난다
    if (event.nativeEvent.isComposing) {
      isEnterWhileComposingRef.current = true;
      return;
    }
    // 사파리: 조합이 먼저 끝나고, 그 뒤 keyCode 229인 Enter가 온다
    if (event.keyCode === 229) selectHighlightedOption();
  };

  const handleCompositionEnd = () => {
    if (!isEnterWhileComposingRef.current) return;
    isEnterWhileComposingRef.current = false;
    selectHighlightedOption();
  };

  return (
    <div
      ref={rootRef}
      className='relative w-full'
      onBlurCapture={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) {
          setIsOpen(false);
          onBlur?.();
        }
      }}
    >
      <Command
        className='h-[4.2rem] w-full'
        value={activeOption}
        onValueChange={setHighlightedOption}
      >
        <Input
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label={ariaLabel}
          hasBorder={false}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onCompositionEnd={handleCompositionEnd}
          value={query}
          className={cn('h-[4.2rem] w-full', inputClassName)}
        />

        {isOpen && (
          <div className='absolute top-[calc(4.2rem+0.5rem)] left-0 w-full'>
            <CommandList
              className={cn(
                'bg-black-1 max-h-[20rem] overflow-auto rounded-[0.4rem] p-[0.4rem] shadow-[0_0_12px_0_rgba(69,66,90,0.14)]',
                optionWrapperClassName,
              )}
            >
              <CommandEmpty className='caption-14-md p-[1rem] text-gray-400'>
                결과가 없습니다.
              </CommandEmpty>

              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleOptionSelect(option)}
                    className={cn(
                      'caption-14-md rounded-[0.4rem] p-[1rem] hover:cursor-pointer hover:bg-gray-50',
                      optionClassName,
                    )}
                  >
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
