// import React from 'react';
// import { ModalClose, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalProvider, ModalTitle, ModalTrigger } from '../modal';
// import { Button } from '../button';

// interface ModalProps {
//   title: string;
//   description: string;
//   children: React.ReactNode;
//   onCancel: () => void;
//   onConfirm: () => void;
//   modalTrigger:React.ReactNode

// }

// const Modal: React.FC<ModalProps> = ({ title, description, children, onCancel, onConfirm , modalTrigger}) => {
//   return (
//     <ModalProvider>
//       <ModalTrigger>{modalTrigger}</ModalTrigger>
//       <ModalContent>
//         <ModalHeader>
//           <ModalTitle>{title}</ModalTitle>
//           <ModalDescription>{description}</ModalDescription>
//         </ModalHeader>
//         <div>{children}</div>
//         <ModalFooter>
//           <Button onClick={onCancel}>Cancel</Button>
//           <Button onClick={onConfirm}>Confirm</Button>
//         </ModalFooter>
//         <ModalClose />
//       </ModalContent>
//     </ModalProvider>
//   );
// };

// export default Modal;

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
  modalTrigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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
}) => {
  return (
    <ModalProvider open={open} onOpenChange={onOpenChange}>
      <ModalTrigger asChild>{modalTrigger}</ModalTrigger>
      <ModalContent className="max-h-3/4 h-full">
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
