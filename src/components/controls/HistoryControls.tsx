import { useTheme } from "../../hooks/useTheme";
import { ControlButton } from "./ControlButton";
import { LuUndo2, LuRedo2 } from "react-icons/lu";

type HistoryControlsProps = {
  undo: () => void;
  redo: () => void;
};

export default function HistoryControls({ undo, redo }: HistoryControlsProps) {
  const { colors } = useTheme();
  return (
    <div
      className="flex items-center border rounded-2xl gap-px"
      style={{ borderColor: colors.uiBorder, backgroundColor: colors.uiBg }}
    >
      <ControlButton
        Icon={LuUndo2}
        className="rounded-l-[14px]"
        onClick={undo}
      />
      {/* <span
        className="h-8 w-0.5 rounded"
        style={{ backgroundColor: colors.uiBorder }}
      ></span> */}
      <ControlButton
        Icon={LuRedo2}
        className="rounded-r-[14px]"
        onClick={redo}
      />
    </div>
  );
}
