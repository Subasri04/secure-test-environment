import { useEffect } from "react";
import { logAssessmentEvent } from "../services/assessmentLogger";

export function useClipboardTracking(disabled = false) {
  useEffect(() => {
    if (disabled) return;

    const handleCopy = async () => {
      await logAssessmentEvent({
        eventType: "copy_attempt",
        questionId: null,
        metadata: {},
      });
    };

    const handleCut = async () => {
      await logAssessmentEvent({
        eventType: "cut_attempt",
        questionId: null,
        metadata: {},
      });
    };

    const handlePaste = async () => {
      await logAssessmentEvent({
        eventType: "paste_attempt",
        questionId: null,
        metadata: {},
      });
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
    };
  }, [disabled]);
}
