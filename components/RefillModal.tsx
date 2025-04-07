"use client";
import Modal from "./Modal";

interface RefillModalProps {
  show: boolean;
  onClose: () => void;
  onBuyRefill: () => void;
  onUseRefill: () => void;
  refillMessage: string;
  disableBuy: boolean;
  disableUse: boolean;
}

const RefillModal: React.FC<RefillModalProps> = ({
  show,
  onClose,
  onBuyRefill,
  onUseRefill,
  refillMessage,
  disableBuy,
  disableUse,
}) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      heading={""}
      additionalClasses="mt-[20vh] sm:mt-0 sm:h-1/2 h-2/5 sm:h-3/4 mx-4"
    >
      <div>
        <button
          onClick={onBuyRefill}
          className="btn-primary w-24 sm:w-40 m-4 sm:ml-2 text-xs sm:text-base bg-red-500 dark:bg-red-600 dark:hover:border-red-400 dark:hover:text-red-400"
          disabled={disableBuy}
        >
          {disableBuy ? "Adding..." : "Add Refill/s"}
        </button>
        <button
          onClick={onUseRefill}
          className="btn-primary w-24 sm:w-40 m-4 sm:ml-2 text-xs sm:text-base"
          disabled={disableUse}
        >
          {disableUse ? "Using..." : "Use Refill"}
        </button>
      </div>
      <p className="text-black dark:text-white text-center">{refillMessage}</p>
    </Modal>
  );
};

export default RefillModal;
