import { useEffect } from "react";
import { motion } from "motion/react";
import { LuX } from "react-icons/lu";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { useTheme } from "../../hooks/useTheme";
import type { IconType } from "react-icons";

const shortcuts = [
  { keys: "Space", action: "Hold to pan" },
  { keys: "L", action: "Line tool" },
  { keys: "R", action: "Rectangle tool" },
  { keys: "C", action: "Circle tool" },
  { keys: "P", action: "Pencil tool" },
  { keys: "T", action: "Text tool" },
  { keys: "S", action: "Selection tool" },
  { keys: "E", action: "Eraser tool" },
  { keys: "Ctrl + Z", action: "Undo" },
  { keys: "Ctrl + Y / Ctrl + Shift + Z", action: "Redo" },
];

type SocialLink = {
  id: string;
  label: string;
  href: string;
  Icon: IconType;
  color: string;
};

const socialLinks: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/kurocodes/KuroSketch",
    Icon: FaGithub,
    color: "#181717",
  },
  {
    id: "twitter",
    label: "X / Twitter",
    href: "https://x.com/kurocodes/",
    Icon: FaXTwitter,
    color: "#111111",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/deepak-vaishnav-541199375/",
    Icon: FaLinkedin,
    color: "#0A66C2",
  },
];

export default function InfoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { colors } = useTheme();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 max-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ y: 8, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-xl rounded-2xl border shadow-xl h-full overflow-y-auto"
        style={{ backgroundColor: colors.uiBg, borderColor: colors.uiBorder }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-5 pt-5">
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: colors.uiText }}
            >
              About KuroSketch
            </h2>
            <p className="mt-1 text-sm" style={{ color: colors.uiText }}>
              KuroSketch is a lightweight drawing playground for fast ideas and
              clean diagrams. Sketch shapes, write text, and move around the
              canvas with simple tools and shortcuts.
            </p>
          </div>
          <motion.button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#d1d5db]"
            style={{ color: colors.uiText }}
          >
            <LuX size={18} />
          </motion.button>
        </div>

        <div className="px-5 pb-5 pt-4">
          <div className="flex items-center justify-between">
            <h3
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: colors.uiText }}
            >
              Connect
            </h3>
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <LinkButton key={link.id} link={link} />
              ))}
            </div>
          </div>

          <h3
            className="mt-4 text-sm font-semibold uppercase tracking-wide"
            style={{ color: colors.uiText }}
          >
            Keyboard Shortcuts
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {shortcuts.map((item) => (
              <div
                key={item.keys}
                className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm"
                style={{
                  color: colors.uiText,
                  borderColor: colors.uiBorder,
                }}
              >
                <span className="font-medium">{item.keys}</span>
                <span>{item.action}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LinkButton({ link }: { link: SocialLink }) {
  const { colors } = useTheme();
  return (
    <motion.a
      key={link.id}
      href={link.href}
      target="_blank"
      rel="noreferrer"
      aria-label={link.label}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.98 }}
      style={{
        color: link.color,
        borderColor: colors.uiBorder,
        backgroundColor: colors.uiBg,
      }}
    >
      <link.Icon size={24} />
    </motion.a>
  );
}
