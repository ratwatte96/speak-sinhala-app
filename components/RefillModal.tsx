"use client";
import { useState } from "react";
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
    <Modal show={show} onClose={onClose} heading={""}>
      <div>
        <button
          onClick={onBuyRefill}
          className="w-24 bg-red-500 text-black hover:text-white rounded-lg m-4 px-3 py-1 text-xs dark:text-white hover:text-black dark:hover:border dark:hover:border-red-400 dark:hover:text-red-400 dark:hover:bg-black focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
          disabled={disableBuy}
        >
          {disableBuy ? "Adding..." : "Add Refill/s"}
        </button>
        <button
          onClick={onUseRefill}
          className="w-24 rounded-lg text-black hover:text-white bg-green-500 m-4 px-3 py-1 text-xs dark:text-white hover:text-black dark:hover:border dark:hover:border-green-400 dark:hover:text-green-400 dark:hover:bg-black focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
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
