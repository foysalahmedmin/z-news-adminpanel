import { updateLanguage as setLanguageSlice } from "@/redux/slices/setting-slice";
import type { AppDispatch, RootState } from "@/redux/store";
import type { TSettingState } from "@/types/state.type";
import { useDispatch, useSelector } from "react-redux";

const useSetting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const setting = useSelector((state: RootState) => state.setting);

  const setLanguage = (payload: TSettingState["language"]) =>
    dispatch(setLanguageSlice(payload));
  const toggleLanguage = () => {
    if (setting.language === "en") {
      setLanguage("bn");
    } else if (setting.language === "bn") {
      setLanguage("en");
    }
  };

  return { setting, setLanguage, toggleLanguage };
};

export default useSetting;
