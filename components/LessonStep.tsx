interface LessonStepProps {
  nextStep: () => void;
}

export const LessonStep: React.FC<LessonStepProps> = ({ nextStep }) => {
  return (
    <div className="sm:w-2/3 w-full text-sm sm:text-base">
      <p className="flex flex-col items-center text-skin-base w-full">
        Unfortunately using the words &apos;this&apos; and &apos;that&apos; are
        more complicated in sinhala than in english.
        <div className="mt-4">
          There is 1 one word for &apos;this&apos; but 3 word for
          &apos;that&apos;:
          <ul className="list-disc list-inside">
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
        </div>
      </p>
      <p className="flex flex-col items-center text-skin-base w-full mt-4">
        <div className="mt-4">
          Each of these four word has 3 variations to refer to a person, an
          thing or an animal:
          <table className="w-full border-t border-skin-base text-left text-xs my-2">
            <thead className="text-xs uppercase">
              <tr>
                <th className="border border-skin-base">This</th>
                <th className="border border-skin-base">This person</th>
                <th className="border border-skin-base">This thing</th>
                <th className="border border-skin-base">This animal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-skin-base">mē</td>
                <td className="border border-skin-base">mēyā</td>
                <td className="border border-skin-base">mēkə</td>
                <td className="border border-skin-base">mū</td>
              </tr>
            </tbody>
          </table>
          <table className="w-full border-t border-skin-base text-left text-xs my-2 ">
            <thead className="text-xs uppercase">
              <tr>
                <th className="border border-skin-base">That</th>
                <th className="border border-skin-base">That person</th>
                <th className="border border-skin-base">That thing</th>
                <th className="border border-skin-base">That animal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-skin-base">arə</td>
                <td className="border border-skin-base">arəya</td>
                <td className="border border-skin-base">arəkə</td>
                <td className="border border-skin-base">arū</td>
              </tr>
              <tr>
                <td className="border border-skin-base">ē</td>
                <td className="border border-skin-base">ēya</td>
                <td className="border border-skin-base">ēkə</td>
                <td className="border border-skin-base">ū</td>
              </tr>
              <tr>
                <td className="border border-skin-base">oyə</td>
                <td className="border border-skin-base">oyā</td>
                <td className="border border-skin-base">ōkə</td>
                <td className="border border-skin-base">ōkā</td>
              </tr>
            </tbody>
          </table>
        </div>
      </p>
      <div className="flex justify-center">
        <button
          key="confirm-button"
          onClick={() => nextStep()}
          className="w-80 my-4 bg-skin-accent rounded-lg border border-0 border-skin-base px-3 py-1"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};
