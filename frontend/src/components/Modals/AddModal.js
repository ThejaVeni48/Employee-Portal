import { Modal,ModalBody,ModalFooter,ModalHeader } from "flowbite-react";

const AppModal = ({
  isOpen,
  onClose,
  title,
  size = "xl",
  children,
  footer,
  dismissible = true,
}) => {
  return (
    <Modal show={isOpen} onClose={onClose} size={size} dismissible={dismissible}>
      {title && <ModalHeader>{title}</ModalHeader>}

      <ModalBody>
        <div className="space-y-6">{children}</div>
      </ModalBody>

      {footer && <ModalFooter>{footer}</ModalFooter>}
    </Modal>
  );
};

export default AppModal;
