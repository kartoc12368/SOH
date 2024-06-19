import { Modal } from "@nextui-org/react";
 export default function ModalComponent({
  modalIsOpen,
  modalImage,
  closeModal,styles
}) {
  return (
    <>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div className={styles.modalContent}>
          <img
            src={`${process.env.NEXT_PUBLIC_serverAPI}/fundRaiser/fundraiser-page/${modalImage}`}
            alt="Modal Image"
            className={styles.modalImage}
          />
          <button onClick={closeModal} className={styles.closeModal}>
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}
