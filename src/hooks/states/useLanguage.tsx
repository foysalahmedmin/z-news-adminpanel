import { LANGUAGES } from "@/config";
import { setLanguage as setLanguageSlice } from "@/redux/slices/language-slice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const useLanguage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const code = useSelector((state: RootState) => state.language);

  const setLanguage = (payload: string) => dispatch(setLanguageSlice(payload));
  const toggleLanguage = () => {
    if (code === "en") {
      setLanguage("bn");
    } else if (code === "bn") {
      setLanguage("en");
    }
  };

  const language = LANGUAGES?.[code] || {};
  const languages = Object.values(LANGUAGES);

  return { languages, language, code, setLanguage, toggleLanguage };
};

export default useLanguage;
