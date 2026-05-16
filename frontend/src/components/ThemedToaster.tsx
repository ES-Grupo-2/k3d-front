import { Toaster } from "react-hot-toast";
import { useThemeColors } from "../hooks/useThemeColors";

export function ThemedToaster() {
  const colors = useThemeColors();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: colors.surface,
          color: colors.foreground,
          border: `1px solid ${colors.border}`,
        },
      }}
    />
  );
}
