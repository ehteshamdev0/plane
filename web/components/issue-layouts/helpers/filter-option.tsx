import React from "react";
// lucide icons
import { Check } from "lucide-react";

type Props = {
  icon?: React.ReactNode;
  isChecked: boolean;
  title: React.ReactNode;
  onClick?: () => void;
  multiple?: boolean;
};

export const FilterOption: React.FC<Props> = (props) => {
  const { icon, isChecked, multiple = true, onClick, title } = props;

  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded p-1.5 hover:bg-custom-background-80 w-full"
      onClick={onClick}
    >
      <div
        className={`flex-shrink-0 w-3 h-3 grid place-items-center bg-custom-background-90 border ${
          isChecked ? "bg-custom-primary-100 border-custom-primary-100 text-white" : "border-custom-border-300"
        } ${multiple ? "rounded-sm" : "rounded-full"}`}
      >
        {isChecked && <Check size={10} strokeWidth={3} />}
      </div>
      <div className="flex items-center gap-2 truncate">
        <div className="flex-shrink-0 grid place-items-center">{icon}</div>
        <div className="flex-grow truncate text-custom-text-200 text-xs">{title}</div>
      </div>
    </button>
  );
};