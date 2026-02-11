import { useEffect } from "react";
import { logAssessmentEvent, syncAssessmentLogs } from "../services/assessmentLogger";

export function useTabFocusTracking(
  employeeId: string | undefined,
  disabled = false
) {
  useEffect(() => {
    if (disabled) return;
    if (!employeeId) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // User left tab
        await logAssessmentEvent({
          eventType: "tab_blur",
          questionId: null,
          metadata: {},
        });
      } else {
        // User returned
        await logAssessmentEvent({
          eventType: "tab_focus",
          questionId: null,
          metadata: {},
        });

        // ✅ AUTO-BATCH SYNC ON RETURN
        await syncAssessmentLogs(employeeId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [employeeId, disabled]);
}
