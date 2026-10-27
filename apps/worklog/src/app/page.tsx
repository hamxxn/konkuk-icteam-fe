'use client';

import { useState } from 'react';
import {
  Breadcrumb,
  BottomCTAButton,
  Button,
  CheckBox,
  ComboBox,
  ConfirmModal,
  DatePicker,
  Dropdown,
  Header,
  IconButton,
  ImageCarousel,
  ImagePreview,
  Input,
  Message,
  ResultModal,
  SearchBar,
  SectionStack,
  Slider,
  StateChip,
  Stepper,
  TagChip,
  Tabs,
  Textarea,
  useSectionStack,
  type DateRange,
} from '@konkuk-icteam-fe/design-system/ui';
import { IconArrowLeft, IconClose, IconSearch } from '@konkuk-icteam-fe/design-system/assets';

const CHIP_TONES = ['gray', 'blue', 'red', 'purple', 'green', 'black', 'white'] as const;

const COMBO_OPTIONS = ['서울', '부산', '대구', '인천', '광주'];
const TAG_OPTIONS = ['프론트엔드', '백엔드', '디자인', '인프라', '기획'];

const SAMPLE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='280' height='400'><rect width='100%' height='100%' fill='#8e8e93'/></svg>",
)}`;

const CAROUSEL_IMAGES = Array.from({ length: 3 }, (_, index) => ({
  src: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='240'><rect width='100%' height='100%' fill='#${
      ['77bea4', '4a90e2', 'b58aeb'][index]
    }'/></svg>`,
  )}`,
  alt: `샘플 이미지 ${index + 1}`,
}));

const TABS = [
  { label: '업무일지', value: 'worklog' },
  { label: '이슈', value: 'issue' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='flex flex-col gap-[1.6rem] border-b border-gray-50 py-[3.2rem]'>
      <h2 className='font-18-bd text-black'>{title}</h2>
      <div className='flex flex-col gap-[1.6rem]'>{children}</div>
    </section>
  );
}

export default function Home() {
  const [comboValue, setComboValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('worklog');
  const [sliderValue, setSliderValue] = useState<[number, number]>([50000, 150000]);
  const [stepperValue, setStepperValue] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const { items, activeId, openSection, closeSection, activateSection } = useSectionStack();

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((selected) => selected !== tag) : [...prev, tag],
    );
  };

  return (
    <div className='mx-auto flex w-full max-w-[80rem] flex-col px-[2rem] pb-[8rem]'>
      <h1 className='font-24-bd py-[3.2rem] text-black'>디자인 시스템 컴포넌트 모음</h1>

      <Section title='Header'>
        <div className='relative h-[6rem] border border-gray-50'>
          <Header
            left={<IconArrowLeft />}
            center={<span className='text-black'>Title</span>}
            right={<IconSearch />}
          />
        </div>
      </Section>

      <Section title='Breadcrumb'>
        <Breadcrumb>
          <Breadcrumb.Item href='/worklog'>업무일지</Breadcrumb.Item>
          <Breadcrumb.Item>2025.05.21</Breadcrumb.Item>
        </Breadcrumb>
      </Section>

      <Section title='Tabs'>
        <Tabs>
          <Tabs.List activeValue={activeTab} tabs={TABS}>
            {TABS.map(({ label, value }) => (
              <Tabs.Item
                key={value}
                value={value}
                activeValue={activeTab}
                href={`#${value}`}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveTab(value);
                }}
              >
                {label}
              </Tabs.Item>
            ))}
          </Tabs.List>
        </Tabs>
      </Section>

      <Section title='Button'>
        <div className='flex flex-wrap gap-[0.8rem]'>
          <Button color='black'>Solid Black</Button>
          <Button tone='solid' color='blue'>
            Solid Blue
          </Button>
          <Button tone='subtle' color='red'>
            Subtle Red
          </Button>
          <Button tone='subtle_2' color='gray'>
            Subtle2 Gray
          </Button>
          <Button size='small'>Small</Button>
          <Button disabled>Disabled</Button>
          <Button isLoading>Loading</Button>
        </div>
      </Section>

      <Section title='IconButton'>
        <div className='flex gap-[0.8rem]'>
          <IconButton aria-label='닫기'>
            <IconClose />
          </IconButton>
          <IconButton aria-label='검색'>
            <IconSearch />
          </IconButton>
        </div>
      </Section>

      <Section title='BottomCTAButton'>
        <div className='bg-black-1 flex h-[16rem] flex-col border border-gray-50 p-[1.6rem]'>
          <div>콘텐츠 영역</div>
          <BottomCTAButton className='mt-auto flex flex-col gap-[0.6rem]'>
            <BottomCTAButton.Double
              leftButton={
                <Button size='large' tone='subtle_2' color='gray'>
                  취소
                </Button>
              }
              rightButton={
                <Button size='large' color='black'>
                  확인
                </Button>
              }
            />
          </BottomCTAButton>
        </div>
      </Section>

      <Section title='StateChip'>
        <div className='flex flex-wrap gap-[0.8rem]'>
          {CHIP_TONES.map((tone) => (
            <StateChip key={tone} label={tone} tone={tone} />
          ))}
        </div>
      </Section>

      <Section title='TagChip'>
        <div className='flex min-h-[2.8rem] flex-wrap gap-[0.8rem]'>
          {selectedTags.map((tag) => (
            <TagChip key={tag} tone='blue' label={tag} onRemove={handleTagToggle} />
          ))}
        </div>
        <div className='flex flex-wrap gap-[0.8rem]'>
          {TAG_OPTIONS.map((tag) => (
            <TagChip
              key={tag}
              tone='blue'
              label={tag}
              isSelected={selectedTags.includes(tag)}
              onClick={handleTagToggle}
            />
          ))}
        </div>
      </Section>

      <Section title='Input'>
        <Input placeholder='입력해주세요' />
      </Section>

      <Section title='SearchBar'>
        <SearchBar placeholder='장소 이름을 검색하세요' aria-label='장소 검색' />
      </Section>

      <Section title='Textarea'>
        <Textarea placeholder='내용을 입력해주세요' rows={4} />
      </Section>

      <Section title='CheckBox'>
        <CheckBox checked={checked} onChange={(event) => setChecked(event.target.checked)}>
          이용약관에 동의합니다
        </CheckBox>
      </Section>

      <Section title='ComboBox'>
        <div className='w-[36rem]'>
          <ComboBox options={COMBO_OPTIONS} value={comboValue} onChange={setComboValue} />
        </div>
      </Section>

      <Section title='Dropdown'>
        <div className='w-[20rem]'>
          <Dropdown options={COMBO_OPTIONS} value={dropdownValue} onChange={setDropdownValue} />
        </div>
      </Section>

      <Section title='Slider'>
        <div className='flex w-[36rem] flex-col items-center gap-[1.6rem]'>
          <div className='font-16-md text-black'>
            {sliderValue[0]} ~ {sliderValue[1]}
          </div>
          <Slider min={10000} max={400000} step={10000} value={sliderValue} onChange={setSliderValue} />
        </div>
      </Section>

      <Section title='Stepper'>
        <Stepper
          value={stepperValue}
          isDisabledMinus={stepperValue <= 0}
          isDisabledAdd={stepperValue >= 10}
          handleClickMinus={() => setStepperValue((prev) => Math.max(0, prev - 1))}
          handleClickAdd={() => setStepperValue((prev) => Math.min(10, prev + 1))}
        />
      </Section>

      <Section title='Message'>
        <div className='flex flex-col gap-[0.8rem]'>
          <Message id='help-message' message='도움말 메시지입니다.' variant='help' />
          <Message id='error-message' message='에러 메시지입니다.' variant='error' />
          <Message id='success-message' message='성공 메시지입니다.' variant='success' />
        </div>
      </Section>

      <Section title='DatePicker'>
        <div className='flex flex-wrap gap-[3.2rem]'>
          <div className='bg-black-1 w-[32rem] p-[1.6rem]'>
            <DatePicker selectedDate={selectedDate} handleDateChangeAction={setSelectedDate} />
          </div>
          <div className='bg-black-1 w-[32rem] p-[1.6rem]'>
            <DatePicker
              mode='range'
              color='blue'
              selectedRange={selectedRange}
              handleRangeChangeAction={setSelectedRange}
            />
          </div>
        </div>
      </Section>

      <Section title='ImageCarousel'>
        <div className='w-[36rem]'>
          <ImageCarousel images={CAROUSEL_IMAGES} variant='dots' />
        </div>
      </Section>

      <Section title='ImagePreview'>
        <ImagePreview
          imageSrc={SAMPLE_IMAGE}
          imageAlt='임시 이미지'
          handleRemove={() => {}}
          handleClickImage={() => {}}
        />
      </Section>

      <Section title='ConfirmModal'>
        <Button onClick={() => setIsConfirmOpen(true)}>ConfirmModal 열기</Button>
        <ConfirmModal
          open={isConfirmOpen}
          handleOpenChange={setIsConfirmOpen}
          title='정말 삭제하시겠어요?'
          description='삭제하면 되돌릴 수 없어요'
          buttons={[
            { label: '취소', size: 'medium', tone: 'subtle_2', color: 'gray' },
            { label: '삭제', size: 'medium', color: 'black' },
          ]}
        />
      </Section>

      <Section title='ResultModal'>
        <Button onClick={() => setIsResultOpen(true)}>ResultModal 열기</Button>
        <ResultModal
          open={isResultOpen}
          handleOpenChange={setIsResultOpen}
          type='success'
          title='업무일지 작성이 완료되었어요!'
          description="'내 업무일지'에서 작성한 내용을 확인해보세요"
          buttons={[
            { label: '닫기', size: 'medium', tone: 'subtle_2', color: 'gray' },
            { label: '내 업무일지 확인', size: 'medium', color: 'black' },
          ]}
        />
      </Section>

      <Section title='SectionStack'>
        <div className='flex flex-col gap-[1.6rem]'>
          <Button
            display='inline'
            size='small'
            onClick={() =>
              openSection({
                id: `section-${items.length + 1}`,
                title: `항목 ${items.length + 1}`,
                content: (
                  <p className='caption-14-rg text-gray-700'>섹션 {items.length + 1}의 내용입니다.</p>
                ),
              })
            }
          >
            항목 열기
          </Button>

          <SectionStack activeId={activeId} handleActivate={activateSection} handleClose={closeSection}>
            {items.map((item) => (
              <SectionStack.Item key={item.id} id={item.id} title={item.title}>
                <SectionStack.ItemContainer>
                  <SectionStack.ItemTitle className='px-[2.4rem] pt-[2.4rem] pb-[1.6rem]'>
                    {item.title}
                  </SectionStack.ItemTitle>
                  <SectionStack.ItemContent>{item.content}</SectionStack.ItemContent>
                </SectionStack.ItemContainer>
              </SectionStack.Item>
            ))}
          </SectionStack>
        </div>
      </Section>
    </div>
  );
}
