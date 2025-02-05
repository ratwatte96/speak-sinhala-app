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
    <Modal show={show} onClose={onClose} heading={"Note"}>
      <div>
        <button
          onClick={onBuyRefill}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
          disabled={disableBuy}
        >
          Add Refill Rs.0
        </button>
        <button
          onClick={onUseRefill}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
          disabled={disableUse}
        >
          Use Refill
        </button>
      </div>
      <p>{refillMessage}</p>
    </Modal>
  );
};

export default RefillModal;
