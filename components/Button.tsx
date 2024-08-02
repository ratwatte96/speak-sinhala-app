interface ButtonProps {
  callback: (arg0: any) => any;
  buttonLabel: string;
  tailwindOverride?: string;
}

export const Button: React.FC<ButtonProps> = ({
  callback,
  buttonLabel,
  tailwindOverride,
}) => {
  return (
    <button
      onClick={() => callback("letters")}
      className={`${
        tailwindOverride !== null ? tailwindOverride : "w-1/2"
      } rounded-lg border border-skin-base px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base`}
    >
      {buttonLabel}
    </button>
  );
};
