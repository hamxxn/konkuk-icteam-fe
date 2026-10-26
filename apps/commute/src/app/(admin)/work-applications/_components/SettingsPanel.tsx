import { Fragment, useId } from 'react';
import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import { DatePicker, Input, Message, TagChip } from '@konkuk-icteam-fe/design-system/ui';
import DateRangeField from '../../_components/DateRangeField';
import type { WorkApplicationSettings } from '../../_apis/workApplications';
import { createDateKeepingTime, createDateWithTime, getTimeOfDay } from '../_utils/applyDateTime';
import { getNonWorkingDates } from '../_utils/getNonWorkingDates';
import { formatMonthDay } from '@/shared/utils/formatDate';
import { IconEllipse } from '@konkuk-icteam-fe/design-system/assets';
import type { SettingsErrors } from '../_lib/workApplicationSchema';

type NumberSettingKey = Exclude<
  keyof WorkApplicationSettings,
  'applyStartDate' | 'applyEndDate' | 'unavailableDates'
>;

type SettingsPanelProps = {
  monthKey: string;
  settings: WorkApplicationSettings;
  isEditable: boolean;
  errors?: SettingsErrors;
  onChange: (settings: WorkApplicationSettings) => void;
};

// 근로시간 기준 표의 줄. 주간·월간마다 최소·최대 칸이 짝을 이룬다
const HOUR_ROWS: { label: string; minKey: NumberSettingKey; maxKey: NumberSettingKey }[] = [
  { label: '주간', minKey: 'weeklyMinHours', maxKey: 'weeklyMaxHours' },
  { label: '월간', minKey: 'monthlyMinHours', maxKey: 'monthlyMaxHours' },
];

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section = ({ title, children }: SectionProps) => (
  // 점을 제목 왼쪽에 붙이도록 section을 기준 위치로 둔다
  <section className='relative flex flex-col gap-[0.8rem]'>
    <IconEllipse
      aria-hidden
      className='text-red absolute top-[0.8rem] left-[-1.6rem] h-[0.4rem] w-[0.4rem]'
    />
    <h3 className='font-14-bd text-black'>{title}</h3>
    {children}
  </section>
);

// 근로신청 설정. 신청 기간, 근무 인원·시간 기준, 근무할 수 없는 날을 정한다
export default function SettingsPanel({
  monthKey,
  settings,
  isEditable,
  errors = {},
  onChange,
}: SettingsPanelProps) {
  const errorIdPrefix = useId();
  const [year = 0, month = 1] = monthKey.split('-').map(Number);
  const monthStart = `${monthKey}-01`;
  const monthEnd = `${monthKey}-${new Date(year, month, 0).getDate()}`;
  // 주말·공휴일은 원래 근무가 없으니 근무 불가 날짜로 고를 수 없다
  const nonWorkingDates = getNonWorkingDates(monthKey);

  const updateSetting = <Key extends keyof WorkApplicationSettings>(
    key: Key,
    value: WorkApplicationSettings[Key],
  ) => {
    onChange({ ...settings, [key]: value });
  };

  // 달력·칩은 YYYY-MM-DD 글자로 다룬다
  const unavailableDateKeys = settings.unavailableDates.map(toISO);

  const handleUnavailableDatesChange = (dateKeys: string[]) => {
    updateSetting('unavailableDates', dateKeys.map(parseISO));
  };

  return (
    <div className='bg-black-1 mx-[2.1rem] mb-[2rem] grid grid-cols-2 gap-[3.2rem] rounded-[1.2rem] border border-gray-50 p-[3rem]'>
      <div className='flex flex-col gap-[2.4rem]'>
        <Section title='신청 기간'>
          <DateRangeField
            placeholder='신청 기간을 골라 주세요'
            startDate={toISO(settings.applyStartDate)}
            endDate={toISO(settings.applyEndDate)}
            disabled={!isEditable}
            // 날짜를 바꿔도 정해 둔 시작·마감 시각은 그대로 둔다
            onChange={(startDateKey, endDateKey) =>
              onChange({
                ...settings,
                applyStartDate: createDateKeepingTime(startDateKey, settings.applyStartDate),
                applyEndDate: createDateKeepingTime(endDateKey, settings.applyEndDate),
              })
            }
          />
          <div className='grid grid-cols-2 gap-[0.8rem]'>
            <label className='flex flex-col gap-[0.4rem]'>
              <span className='caption-12-md text-gray-500'>시작 시각</span>
              <Input
                type='time'
                disabled={!isEditable}
                value={getTimeOfDay(settings.applyStartDate)}
                onChange={(event) =>
                  updateSetting(
                    'applyStartDate',
                    createDateWithTime(settings.applyStartDate, event.target.value),
                  )
                }
              />
            </label>
            <label className='flex flex-col gap-[0.4rem]'>
              <span className='caption-12-md text-gray-500'>마감 시각</span>
              <Input
                type='time'
                disabled={!isEditable}
                hasError={errors.applyEndDate !== undefined}
                aria-invalid={errors.applyEndDate !== undefined}
                value={getTimeOfDay(settings.applyEndDate)}
                onChange={(event) =>
                  updateSetting(
                    'applyEndDate',
                    createDateWithTime(settings.applyEndDate, event.target.value),
                  )
                }
              />
            </label>
          </div>
          <Message
            id={`${errorIdPrefix}-period`}
            message={errors.applyStartDate ?? errors.applyEndDate}
            variant='error'
          />
        </Section>

        <Section title='동시 근무 최대 인원'>
          <div className='w-1/2'>
            <Input
              type='number'
              min={0}
              aria-label={'동시 근무 최대 인원'}
              disabled={!isEditable}
              hasError={errors.maxConcurrentWorkers !== undefined}
              aria-invalid={errors.maxConcurrentWorkers !== undefined}
              value={settings.maxConcurrentWorkers}
              onChange={(event) =>
                updateSetting('maxConcurrentWorkers', Number(event.target.value))
              }
            />
          </div>
          <Message
            id={`${errorIdPrefix}-max-workers`}
            message={errors.maxConcurrentWorkers}
            variant='error'
          />
        </Section>

        <Section title='근로시간 기준'>
          <div className='grid grid-cols-[4rem_1fr_1fr] items-center gap-x-[1.2rem] gap-y-[0.8rem]'>
            <span aria-hidden />
            <span className='caption-12-md text-gray-500'>최소</span>
            <span className='caption-12-md text-gray-500'>최대</span>
            {HOUR_ROWS.map(({ label, minKey, maxKey }) => {
              const rowError = errors[minKey] ?? errors[maxKey];

              return (
                <Fragment key={label}>
                  <span className='caption-14-md text-gray-700'>{label}</span>
                  <Input
                    type='number'
                    min={0}
                    aria-label={label}
                    disabled={!isEditable}
                    hasError={rowError !== undefined}
                    aria-invalid={rowError !== undefined}
                    value={settings[minKey]}
                    onChange={(event) => updateSetting(minKey, Number(event.target.value))}
                  />
                  <Input
                    type='number'
                    min={0}
                    aria-label={label}
                    disabled={!isEditable}
                    hasError={rowError !== undefined}
                    aria-invalid={rowError !== undefined}
                    value={settings[maxKey]}
                    onChange={(event) => updateSetting(maxKey, Number(event.target.value))}
                  />
                  {/* 그 줄 오류는 최소·최대 칸 아래에 붙인다 */}
                  {rowError ? (
                    <div className='col-span-2 col-start-2'>
                      <Message
                        id={`${errorIdPrefix}-${minKey}`}
                        message={rowError}
                        variant='error'
                      />
                    </div>
                  ) : null}
                </Fragment>
              );
            })}
          </div>
        </Section>
      </div>

      <Section title='근무 불가 날짜'>
        <div className='rounded-[1.2rem] border border-gray-50'>
          <DatePicker
            // 달을 바꾸면 그 달 달력부터 다시 보이도록 key로 새로 그린다
            key={monthKey}
            defaultViewDateMonth={parseISO(monthStart)}
            minDate={monthStart}
            maxDate={monthEnd}
            disablePastDates={false}
            disabledDates={nonWorkingDates}
            color='red'
            mode='multiple'
            selectedDates={unavailableDateKeys}
            handleDatesChangeAction={(dateKeys) => {
              if (isEditable) handleUnavailableDatesChange(dateKeys);
            }}
          />
        </div>
        <ul aria-label='근무 불가 날짜' className='flex flex-wrap gap-[0.6rem]'>
          {unavailableDateKeys.length === 0 ? (
            <li className='caption-12-md text-gray-400'>근무 불가 날짜가 없어요.</li>
          ) : (
            unavailableDateKeys.map((dateKey) => (
              <li key={dateKey}>
                <TagChip
                  label={formatMonthDay(dateKey)}
                  tone='red'
                  onRemove={
                    isEditable
                      ? () =>
                          handleUnavailableDatesChange(
                            unavailableDateKeys.filter((key) => key !== dateKey),
                          )
                      : undefined
                  }
                />
              </li>
            ))
          )}
        </ul>
      </Section>
    </div>
  );
}
