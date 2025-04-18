interface ModalProps {
  show: boolean;
  onClose: () => void;
  heading: string;
  children: React.ReactNode;
  additionalClasses?: string;
  removeClose?: boolean;
}

const Modal = ({
  show,
  onClose,
  heading,
  children,
  additionalClasses = "",
  removeClose = false,
}: ModalProps) => {
  if (!show) return null;

  const handleBackgroundClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget && !removeClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 w-full overflow-y-auto bg-gray-600 bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div
        className={`fade-in-quick relative h-3/4 card-container p-5 sm:top-20 sm:mx-auto sm:w-2/5 ${additionalClasses}`}
      >
        <div className="absolute left-0 top-0 p-4">
          {!removeClose && (
            <button
              onClick={onClose}
              className="text-2xl text-black dark:text-white focus:outline-none"
            >
              &times;
            </button>
          )}
        </div>
        <div className="flex flex-col justify-center items-center h-full">
          <h3 className="card-heading">{heading}</h3>
          <div className="pb-3">
            <div className="card-text">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
