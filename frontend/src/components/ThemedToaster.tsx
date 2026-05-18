/**
 * @file Wrapper do `<Toaster />` do react-hot-toast com estilo EyePleasure.
 * @author lukasnascimento1
 */
import { Toaster } from "react-hot-toast";
import { useThemeColors } from "../hooks/useThemeColors";

export function ThemedToaster() {
  const colors = useThemeColors();
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: colors.surfaceStrong || colors.surface,
          color: colors.foreground,
          border: `1px solid ${colors.borderStrong}`,
          borderRadius: "14px",
          backdropFilter: "blur(20px)",
          fontSize: "13px",
          fontWeight: 600,
          boxShadow: "0 12px 36px rgba(0,0,0,.5)",
        },
        success: {
          iconTheme: { primary: colors.success, secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: colors.error, secondary: "#fff" },
        },
      }}
    />
  );
}
