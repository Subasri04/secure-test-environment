import { useEffect } from "react";
import { logEvent } from "../services/eventLogger";

export function useFullscreen() {
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = Boolean(document.fullscreenElement);

      logEvent(
        isFullscreen ? "fullscreen_entered" : "fullscreen_exited",
        {
          fullscreen: isFullscreen,
        }
      );
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);
}
