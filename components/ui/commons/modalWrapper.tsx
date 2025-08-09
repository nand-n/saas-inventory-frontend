import React from "react";
import {
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalProvider,
  ModalTitle,
  ModalTrigger,
} from "../modal";
import { Button } from "../button";

interface ModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  modalTrigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "default" | "sm" | "lg" | "xl" | "full" | null;
}

const Modal: React.FC<ModalProps> = ({
  title,
  description,
  children,
  onCancel,
  onConfirm,
  modalTrigger,
  open,
  onOpenChange,
  size = "default",
}) => {
  return (
    <ModalProvider open={open} onOpenChange={onOpenChange}>
      <ModalTrigger asChild>{modalTrigger}</ModalTrigger>
      <ModalContent size={size} className="max-h-3/4 ">
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </ModalHeader>
        <div className="h-full overflow-auto">{children}</div>
        <ModalFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </ModalFooter>
        <ModalClose />
      </ModalContent>
    </ModalProvider>
  );
};

export default Modal;
