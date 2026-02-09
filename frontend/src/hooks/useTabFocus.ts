import { useEffect } from "react";
import { logEvent } from "../services/eventLogger";

export function useTabFocus() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        logEvent("tab_blur", {
          visibilityState: "hidden",
        });
      } else {
        logEvent("tab_focus", {
          visibilityState: "visible",
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);
}
