let convert = require("sinhala-unicode");

let {
  amaleeToUnicode, //Amalee --> Unicode
  bamaniToUnicode, //Bamini --> Unicode
  dlManelToUnicode, //DL-Manel-bold. --> Unicode
  fmAbayaToUnicode, //FM Abhaya --> Unicode
  kaputaToUnicode, //kaputadotcom --> Unicode
  tanglishToUnicode, //TanGlish (Phonetic) transliterated --> Tamil Unicode
  thibusToUnicode, //Thibus Sinhala --> Unicode
  unicodeToBamini, //Unicode --> Bamini
  unicodeToDlManel, //Unicode --> DL-Manel-bold.
  unicodeToKaputa, //Unicode --> kaputadotcom
  unicodeToTiptaka, //Unicode --> Tipitaka_Sinhala1
  singlishPhoneticToUnicode, //SinGlish (Phonetic) transliterated --> Sinhala Unicode
  singlishToUnicode, //SinGlish transliterated --> Sinhala Unicode
} = convert;

export const SinhalaDisplay = ({ phonetic }: { phonetic: any }) => {
  const result = convert.singlishPhoneticToUnicode(phonetic);
  return (
    <div className="flex justify-center">
      <p className="my-2 text-skin-base text-5xl sm:text-9xl">{result}</p>
    </div>
  );
};
