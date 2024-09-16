interface LessonStepProps {
  nextStep: () => void;
}

export const LessonStep: React.FC<LessonStepProps> = ({ nextStep }) => {
  return (
    <>
      <p className="flex flex-col items-center text-skin-base">
        Unfortunately using the words 'this' and 'that' are more complicated in
        sinhala.
        <ul>
          <li>this = mē</li>
          <li>
            that = arə (referring to something/someone currently visible or
            trying to remember something)
          </li>
          <li>that = ē (referring to something/someone known)</li>
          <li>
            that = oyə (referring to something/someone with or near the
            listener)
          </li>
        </ul>
      </p>

      <button
        key="confirm-button"
        onClick={() => nextStep()}
        className="w-80 my-4 bg-skin-accent rounded-lg border border-0 border-skin-base px-3 py-1"
      >
        Confirm
      </button>
    </>
  );
};
