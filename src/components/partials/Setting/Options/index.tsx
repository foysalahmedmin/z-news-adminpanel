import useSetting from "@/hooks/states/useSetting";
import React from "react";

// ----------------- Theme Options -----------------

export const ThemeOptionSystem = () => {
  const { setting, setTheme } = useSetting();
  return (
    <ThemeOptionLayout
      isActive={setting.theme === "system"}
      label="System"
      onClick={() => setTheme("system")}
    />
  );
};

export const ThemeOptionLight = () => {
  const { setting, setTheme } = useSetting();
  return (
    <ThemeOptionLayout
      isActive={setting.theme === "light"}
      label="Light"
      onClick={() => setTheme("light")}
    />
  );
};

export const ThemeOptionDark = () => {
  const { setting, setTheme } = useSetting();
  return (
    <ThemeOptionLayout
      isActive={setting.theme === "dark"}
      label="Dark"
      dark
      onClick={() => setTheme("dark")}
    />
  );
};

export const ThemeOptionSemiDark = () => {
  const { setting, setTheme } = useSetting();
  return (
    <ThemeOptionLayout
      isActive={setting.theme === "semi-dark"}
      label="Semi Dark"
      semiDark
      onClick={() => setTheme("semi-dark")}
    />
  );
};

// Reusable Theme Option Layout
type ThemeOptionLayoutProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
  dark?: boolean;
  semiDark?: boolean;
};

const ThemeOptionLayout: React.FC<ThemeOptionLayoutProps> = ({
  isActive,
  label,
  onClick,
  dark = false,
  semiDark = false,
}) => {
  const sidebarBg = dark
    ? "bg-gray-800"
    : semiDark
      ? "bg-gray-800"
      : "bg-gray-100";
  const mainBg = dark ? "bg-gray-900" : "bg-white";
  const borderColor = isActive
    ? "border-blue-500 text-blue-600"
    : "border-gray-300";

  return (
    <label
      className={`aspect-video cursor-pointer rounded-lg border-2 p-2 transition-all ${borderColor}`}
      onClick={onClick}
    >
      <div className="h-full w-full">
        <div
          className={`h-full overflow-hidden rounded border shadow-sm ${dark ? "border-gray-700 bg-gray-900" : "bg-white"}`}
        >
          <div className="flex h-full gap-1">
            <div className={`flex w-1/3 flex-col gap-1 ${sidebarBg} p-1`}>
              <div
                className={`h-3 border-b ${dark ? "border-gray-600 bg-gray-700" : "bg-gray-200"} p-1`}
              >
                <div
                  className={`mx-auto h-full w-3/4 rounded ${dark ? "bg-gray-500" : "bg-gray-400"}`}
                />
              </div>
              <div className="space-y-1">
                <div
                  className={`mx-auto h-2 w-3/4 rounded ${dark ? "bg-gray-500" : "bg-gray-400"}`}
                />
                <div
                  className={`mx-auto h-2 w-3/4 rounded ${dark ? "bg-gray-500" : "bg-gray-400"}`}
                />
                <div
                  className={`mx-auto h-2 w-3/4 rounded ${dark ? "bg-gray-500" : "bg-gray-400"}`}
                />
              </div>
            </div>
            <div
              className={`flex flex-1 flex-col justify-between ${mainBg} p-1`}
            >
              <div
                className={`h-3 rounded ${dark ? "bg-gray-700" : "bg-gray-200"}`}
              />
              <div
                className={`h-3 rounded ${dark ? "bg-gray-700" : "bg-gray-200"}`}
              />
            </div>
          </div>
        </div>
      </div>
      <h5 className="mt-2 text-center text-xs font-medium uppercase">
        {label}
      </h5>
    </label>
  );
};

// ----------------- Direction Options -----------------

const DirectionLTR = () => {
  const { setting, setDirection } = useSetting();
  return (
    <DirectionOption
      label="LTR"
      isActive={setting.direction === "ltr"}
      icon="→"
      onClick={() => setDirection("ltr")}
    />
  );
};

const DirectionRTL = () => {
  const { setting, setDirection } = useSetting();
  return (
    <DirectionOption
      label="RTL"
      isActive={setting.direction === "rtl"}
      icon="←"
      onClick={() => setDirection("rtl")}
    />
  );
};

type DirectionOptionProps = {
  label: string;
  isActive: boolean;
  icon: string;
  onClick: () => void;
};

const DirectionOption: React.FC<DirectionOptionProps> = ({
  label,
  isActive,
  icon,
  onClick,
}) => {
  return (
    <label
      className={`aspect-video cursor-pointer rounded-lg border-2 p-2 transition-all ${
        isActive ? "border-blue-500 text-blue-600" : "border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="flex h-full w-full items-center justify-center rounded bg-gray-50">
        <div className="text-2xl">{icon}</div>
      </div>
      <h5 className="mt-2 text-center text-xs font-medium uppercase">
        {label}
      </h5>
    </label>
  );
};

// ----------------- Sidebar Options -----------------

const SidebarExpanded = () => {
  const { setting, setSidebar } = useSetting();
  return (
    <SidebarOption
      isActive={setting.sidebar === "expanded"}
      label="Expanded"
      leftWidth="w-1/2"
      rightWidth="w-1/2"
      onClick={() => setSidebar("expanded")}
    />
  );
};

const SidebarCompact = () => {
  const { setting, setSidebar } = useSetting();
  return (
    <SidebarOption
      isActive={setting.sidebar === "compact"}
      label="Compact"
      leftWidth="w-1/4"
      rightWidth="w-3/4"
      onClick={() => setSidebar("compact")}
    />
  );
};

type SidebarOptionProps = {
  isActive: boolean;
  label: string;
  leftWidth: string;
  rightWidth: string;
  onClick: () => void;
};

const SidebarOption: React.FC<SidebarOptionProps> = ({
  isActive,
  label,
  leftWidth,
  rightWidth,
  onClick,
}) => {
  return (
    <label
      className={`aspect-video cursor-pointer rounded-lg border-2 p-2 transition-all ${
        isActive ? "border-blue-500 text-blue-600" : "border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="flex h-full w-full rounded bg-gray-50">
        <div className={`${leftWidth} rounded-l bg-gray-300`}></div>
        <div className={`${rightWidth} rounded-r bg-gray-200`}></div>
      </div>
      <h5 className="mt-2 text-center text-xs font-medium uppercase">
        {label}
      </h5>
    </label>
  );
};

// ----------------- NameOption & SettingOption -----------------

type SettingName = "theme" | "direction" | "sidebar";
type SettingOption =
  | "system"
  | "light"
  | "dark"
  | "semi-dark"
  | "ltr"
  | "rtl"
  | "expanded"
  | "compact";

const nameOptionElementMap: Partial<
  Record<`${SettingName}-${SettingOption}`, React.ReactElement>
> = {
  "theme-light": <ThemeOptionLight />,
  "theme-dark": <ThemeOptionDark />,
  "theme-system": <ThemeOptionSystem />,
  "theme-semi-dark": <ThemeOptionSemiDark />,
  "direction-ltr": <DirectionLTR />,
  "direction-rtl": <DirectionRTL />,
  "sidebar-expanded": <SidebarExpanded />,
  "sidebar-compact": <SidebarCompact />,
};

const NameOption: React.FC<{
  name: SettingName;
  option: SettingOption;
}> = ({ name, option }) => {
  const key = `${name}-${option}` as keyof typeof nameOptionElementMap;
  return nameOptionElementMap[key] || null;
};

export const SettingOption: React.FC<{ name: SettingName }> = ({ name }) => {
  const nameOptionsMap: Record<SettingName, SettingOption[]> = {
    theme: ["system", "light", "dark", "semi-dark"],
    direction: ["ltr", "rtl"],
    sidebar: ["expanded", "compact"],
  };

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-lg font-semibold capitalize">{name} Settings</h3>
      <div className="grid grid-cols-2 gap-4">
        {nameOptionsMap[name].map((option) => (
          <NameOption key={option} name={name} option={option} />
        ))}
      </div>
    </div>
  );
};
