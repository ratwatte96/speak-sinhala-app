import { AudioPlayer } from "./AudioPlayer";
import TonguePositionImage from "./TonguePositionImage";

//!Refactor

interface LessonStepProps {
  nextStep: (isMistake: boolean) => void;
  data: any;
}

export const LessonStep: React.FC<LessonStepProps> = ({ nextStep, data }) => {
  //?infoDisplay= list, image, table, sound buttons
  //TODO: table and image
  return (
    <div className="min-w-w-4/5 sm:min-w-3/5 text-sm sm:text-base mb-4">
      {data.map(({ text, infoDisplayType, info }: any, i: number) => (
        <div key={i} className="flex mt-4 justify-center">
          {infoDisplayType === "list" ? (
            <div className="flex-col-center text-skin-base w-full">
              <p>{text}</p>
              <div className="mt-4">
                <p>{info.text}</p>
                <ul className="list-disc list-inside">
                  {info.data.map((listItem: any) => (
                    <li key={listItem}>{listItem}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : infoDisplayType === "soundButtons" ? (
            <>
              <div>
                <p className="mb-2 w-72 sm:w-96">{text}</p>
                <p className="w-72 sm:w-96">{info.text}</p>
                <div className="grid grid-cols-2 gap-4">
                  {info.data.map(
                    ({ sound, sinhala, englishWord }: any, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col justify-center items-center mt-4"
                      >
                        <AudioPlayer
                          audioPath={`/audioClips/${sound}.mp3`}
                          display_text={sinhala}
                          onClick={() => {}}
                        />
                        <div className="mt-1">
                          {englishWord ? (
                            <p>{`${sound} like in '${englishWord}'`}</p>
                          ) : (
                            <p>{sound}</p>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          ) : infoDisplayType === "image" ? (
            <>
              <div>
                <p className="mb-2 text-center">{text}</p>
                <p>{info.text}</p>
                <TonguePositionImage
                  src={info.data.imagePath}
                  alt={info.data.imageAlt}
                  width={400}
                  height={400}
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      ))}
      {/* <p className="flex-col-center text-skin-base w-full">
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
      <p className="flex-col-center text-skin-base w-full mt-4">
        <div className="mt-4">
          Each of these four word has 3 variations to refer to a person, a thing
          or an animal:
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
      </p> */}
      <div className=" flex justify-center mt-2 text-red-600">
        <p>Make sure your volume is turned up!!!</p>
      </div>
      <div className="flex justify-center items-center mt-4">
        <button
          key="confirm-button"
          onClick={() => nextStep(false)}
          className="btn-primary flex-center h-8 w-2/5 font-medium focus:ring-4"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};
