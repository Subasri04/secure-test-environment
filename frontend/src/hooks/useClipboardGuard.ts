import { useEffect } from "react";
import { logEvent } from "../services/eventLogger";

export function useClipboardGuard() {
  useEffect(() => {
    const handleCopy = () => {
      logEvent("copy_attempt", {
        source: "keyboard_or_menu",
      });
    };

    const handlePaste = () => {
      logEvent("paste_attempt", {
        source: "keyboard_or_menu",
      });
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);
}
