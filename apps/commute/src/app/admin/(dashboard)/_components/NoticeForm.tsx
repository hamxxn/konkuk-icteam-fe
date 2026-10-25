'use client';

import { useId, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconAdd } from '@konkuk-icteam-fe/design-system/assets';
import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import { Button, Input, Textarea } from '@konkuk-icteam-fe/design-system/ui';
import type { Notice, NoticeInput } from '../../_apis/notices';
import DateRangeField from '../../_components/DateRangeField';
import FieldError from '../../_components/FieldError';
import { createNoticeSchema, type NoticeFormValues } from '../_lib/noticeSchema';

// 새 공지는 오늘부터 일주일 동안 보이게 둔다
const DEFAULT_POSTING_DAYS = 7;

type NoticeFormProps = {
  // 고치는 공지. 없으면 새 공지를 등록한다
  notice?: Notice;
  onSubmit: (input: NoticeInput) => void;
  onCancel?: () => void;
};

// 오늘 0시
const getToday = () => parseISO(toISO(new Date()));

/**
 * 공지 폼의 처음 값을 만듭니다. 고치는 공지가 있으면 그 값을, 없으면 오늘부터 일주일 게시로 둡니다.
 * @param notice 고치는 공지
 * @returns 폼 처음 값
 * @example createInitialValues().endDate; // 오늘 + 6일
 */
const createInitialValues = (notice?: Notice): NoticeFormValues => {
  if (notice) {
    const { title, content, startDate, endDate } = notice;
    return { title, content, startDate, endDate };
  }

  const startDate = getToday();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + DEFAULT_POSTING_DAYS - 1);

  return { title: '', content: '', startDate, endDate };
};

// 공지 등록·수정 폼. 제목, 게시 기간, 내용을 받는다. 게시 기간 동안만 근로학생에게 보인다
export default function NoticeForm({ notice, onSubmit, onCancel }: NoticeFormProps) {
  const isEditing = notice !== undefined;
  // 오늘 이전은 고를 수 없다. 이미 게시 중인 공지는 원래 시작일을 그대로 둘 수 있다
  const [noticeSchema] = useState(() => {
    const today = getToday();
    const minStartDate = notice && notice.startDate < today ? notice.startDate : today;
    return createNoticeSchema(minStartDate);
  });
  const { control, formState, handleSubmit, register, reset, setValue } = useForm<NoticeFormValues>(
    {
      resolver: zodResolver(noticeSchema),
      mode: 'onChange',
      defaultValues: createInitialValues(notice),
    },
  );
  const [startDate, endDate] = useWatch({ control, name: ['startDate', 'endDate'] });
  const errorIdPrefix = useId();
  const titleError = formState.errors.title?.message;
  // 시작일·마감일은 한 칸에서 고르니 오류도 한 줄로 보여 준다
  const periodError = formState.errors.startDate?.message ?? formState.errors.endDate?.message;
  const contentError = formState.errors.content?.message;

  const handlePeriodChange = (startDateKey: string, endDateKey: string) => {
    const options = { shouldDirty: true, shouldValidate: true };
    setValue('startDate', parseISO(startDateKey), options);
    setValue('endDate', parseISO(endDateKey), options);
  };

  const handleValidSubmit = (values: NoticeFormValues) => {
    onSubmit(values);
    // 새 공지는 등록한 뒤 다음 공지를 쓰도록 비운다. 수정은 부모가 폼을 닫는다
    if (!isEditing) reset(createInitialValues());
  };

  return (
    <form
      noValidate
      className='flex flex-col gap-[1.6rem]'
      onSubmit={(event) => void handleSubmit(handleValidSubmit)(event)}
    >
      <label className='flex flex-col gap-[0.8rem]'>
        <span className='font-14-bd text-black'>제목</span>
        <Input
          placeholder='공지 제목을 입력하세요'
          hasError={titleError !== undefined}
          aria-invalid={titleError !== undefined}
          aria-describedby={`${errorIdPrefix}-title`}
          {...register('title')}
        />
        <FieldError id={`${errorIdPrefix}-title`} message={titleError} />
      </label>

      <div className='flex flex-col gap-[0.8rem]'>
        <span className='font-14-bd text-black'>게시 기간</span>
        <DateRangeField
          startDate={toISO(startDate)}
          endDate={toISO(endDate)}
          placeholder='게시 기간을 골라 주세요'
          disablePastDates
          onChange={handlePeriodChange}
        />
        <FieldError id={`${errorIdPrefix}-period`} message={periodError} />
      </div>

      <label className='flex flex-col gap-[0.8rem]'>
        <span className='font-14-bd text-black'>내용</span>
        <Textarea
          rows={5}
          placeholder='근무자에게 알릴 내용을 입력하세요'
          className='resize-none'
          hasError={contentError !== undefined}
          aria-invalid={contentError !== undefined}
          aria-describedby={`${errorIdPrefix}-content`}
          {...register('content')}
        />
        <FieldError id={`${errorIdPrefix}-content`} message={contentError} />
      </label>

      <div className='flex flex-col gap-[0.6rem]'>
        {isEditing ? (
          <div className='grid grid-cols-2 gap-[0.8rem]'>
            <Button size='medium' tone='subtle_2' color='gray' onClick={onCancel}>
              취소
            </Button>
            <Button type='submit' size='medium' color='blue' disabled={!formState.isValid}>
              수정 저장
            </Button>
          </div>
        ) : (
          <>
            <Button
              type='submit'
              size='medium'
              color='blue'
              className='gap-[0.4rem]'
              disabled={!formState.isValid}
            >
              <IconAdd aria-hidden className='h-[1.8rem] w-[1.8rem]' />
              공지 등록
            </Button>
            <p className='caption-10-md text-center text-gray-400'>
              게시 기간 동안 모든 근무자에게 보입니다
            </p>
          </>
        )}
      </div>
    </form>
  );
}
