import { useEffect } from "react";
import { logAssessmentEvent } from "../services/assessmentLogger";

export function useFullscreenEnforcement(disabled = false) {
  useEffect(() => {
    if (disabled) return;

    const requestFullscreen = async () => {
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {
          // ignored
        }
      }
    };

    const onFullscreenChange = async () => {
      if (document.fullscreenElement) {
        await logAssessmentEvent({
          eventType: "fullscreen_entered",
          questionId: null,
          metadata: {},
        });
      } else {
        await logAssessmentEvent({
          eventType: "fullscreen_exited",
          questionId: null,
          metadata: {},
        });
      }
    };

    requestFullscreen();

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [disabled]);
}
