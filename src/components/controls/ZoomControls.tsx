import { useTheme } from "../../hooks/useTheme";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import { ControlButton } from "./ControlButton";

type ZoomControlsProps = {
  zoomIn: () => void;
  zoomOut: () => void;
  // zoomPercent: number;
  // resetZoom: () => void;
};

export default function ZoomControls({
  zoomIn,
  zoomOut,
  // zoomPercent,
  // resetZoom,
}: ZoomControlsProps) {
  const { colors } = useTheme();
  return (
    <div
      className="flex items-center justify-center border rounded-2xl  gap-px"
      style={{ borderColor: colors.uiBorder, backgroundColor: colors.uiBg }}
    >
      <ControlButton
        Icon={LuZoomIn}
        className="rounded-l-[14px]"
        cursor="pointer"
        onClick={zoomIn}
      />
      {/* <button
        type="button"
        onClick={resetZoom}
        className="px-2.5 py-1 text-sm font-medium"
        style={{ color: colors.uiText }}
      >
        {Math.round(zoomPercent)}%
      </button> */}
      <ControlButton
        Icon={LuZoomOut}
        className="rounded-r-[14px]"
        cursor="pointer"
        onClick={zoomOut}
      />
    </div>
  );
}
