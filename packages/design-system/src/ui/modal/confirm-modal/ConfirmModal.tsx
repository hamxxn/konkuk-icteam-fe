import { Modal, ModalButtonProps } from '../base/Modal';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

type ConfirmModalProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  showCloseButton?: boolean;
  title: string;
  description?: string;
  // 제목·설명과 버튼 사이에 넣을 내용 (요약 표, 입력칸 등)
  children?: React.ReactNode;
  buttons: ModalButtonProps[];
  layoutClassName?: string;
  headerClassName?: string;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  footerClassName?: string;
};

export default function ConfirmModal({
  open,
  handleOpenChange,
  showCloseButton = false,
  title,
  description,
  children,
  buttons,
  layoutClassName,
  headerClassName,
  containerClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      handleOpenChange={handleOpenChange}
      showCloseButton={showCloseButton}
      className={cn(
        'bg-black-1 flex w-[28.1rem] flex-col justify-center gap-[1.5rem] rounded-[0.6rem] border-0 p-[1.5rem]',
        layoutClassName,
      )}
    >
      <Modal.Header className={cn('flex flex-col items-center gap-[1.4rem]', headerClassName)}>
        <div
          className={cn(
            'flex flex-col items-center',
            description && 'gap-[0.4rem]',
            containerClassName,
          )}
        >
          <Modal.Title
            className={cn('font-16-md pt-[1rem] whitespace-pre-line text-black', titleClassName)}
          >
            {title}
          </Modal.Title>
          {description && (
            <Modal.Description className={cn('caption-12-md text-gray-500', descriptionClassName)}>
              {description}
            </Modal.Description>
          )}
        </div>
      </Modal.Header>
      {children}
      <Modal.Footer className={cn('flex flex-row gap-[0.5rem]', footerClassName)}>
        <Modal.Buttons buttons={buttons} />
      </Modal.Footer>
    </Modal>
  );
}
