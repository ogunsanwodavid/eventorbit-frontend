import CheckBox from "../../ui/icons/CheckBox";
import CheckBoxOutlineBlank from "../../ui/icons/CheckBoxOutlineBlank";

interface EmailNotificationCheckBoxProps {
  notis: boolean;
  setNotis: (arg: boolean) => void;
  text: string;
  disabled?: boolean;
}

export default function EmailNotisCheckBox({
  notis,
  setNotis,
  text,
  disabled,
}: EmailNotificationCheckBoxProps) {
  function handleClick() {
    if (disabled) return;

    setNotis(!notis);
  }

  return (
    <div
      className={`w-max mt-3 flex items-center gap-x-2 text-black-2 text-[15px] cursor-pointer ${
        disabled && "!opacity-50"
      }`}
      onClick={handleClick}
    >
      {/** Checkbox */}

      {!notis ? (
        <span className="text-[#d4d4d5]">
          <CheckBoxOutlineBlank size="21" />
        </span>
      ) : (
        <span className="text-teal">
          {" "}
          <CheckBox size="21" />
        </span>
      )}

      {/** Text */}
      <span>{text}</span>
    </div>
  );
}
