interface ModalProps {
  show: boolean;
  onClose: () => void;
  heading: string;
  children: React.ReactNode;
}

const Modal = ({ show, onClose, heading, children }: ModalProps) => {
  if (!show) return null;

  const handleBackgroundClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50 "
      onClick={handleBackgroundClick}
    >
      <div className="fade-in-quick relative h-100vh h-full rounded-md border bg-skin-base p-5 shadow-lg sm:top-20 sm:mx-auto sm:w-3/4">
        <div className="absolute left-0 top-0 p-4">
          <button
            onClick={onClose}
            className="text-2xl text-skin-accent text-skin-base focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col justify-center items-center mt-6  h-full">
          <h3 className="text-2xl font-medium leading-6 text-skin-base">
            {heading}
          </h3>
          <div className="pb-3">
            <div className="text-lg text-skin-base">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
