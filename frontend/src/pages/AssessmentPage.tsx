import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography, Button, Alert, Space, Statistic, message } from "antd";
import {
  logAssessmentEvent,
  syncAssessmentLogs,
  lockAssessment,
} from "../services/assessmentLogger";
import {
  initTimer,
  getRemainingSeconds,
  clearTimer,
} from "../services/timerService";
import { APP_CONFIG } from "../config/appConfig";
import { useFullscreenEnforcement } from "../hooks/useFullscreenEnforcement";
import { useClipboardTracking } from "../hooks/useClipboardTracking";
import { useTabFocusTracking } from "../hooks/useTabFocusTracking";

const { Title, Text } = Typography;

const SUBMIT_TIME_KEY = "assessment_submit_time";

const AssessmentPage = () => {
  const { employee_id } = useParams<{ employee_id: string }>();
  const initialSubmitTime = sessionStorage.getItem(SUBMIT_TIME_KEY);

  const [submitted, setSubmitted] = useState<boolean>(
    Boolean(initialSubmitTime)
  );

  const [submittedAt, setSubmittedAt] = useState<string | null>(
    initialSubmitTime
  );

  const [remaining, setRemaining] = useState<number>(0);

  const intervalRef = useRef<number | null>(null);

  useFullscreenEnforcement(submitted);
  useClipboardTracking(submitted);
  useTabFocusTracking(employee_id, submitted);

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    clearTimer();
  }, []);

  const forceSync = useCallback(async () => {
    if (!employee_id) return;
    await syncAssessmentLogs(employee_id);
  }, [employee_id]);

  const finalizeSubmission = useCallback((msg: string) => {
    const time = new Date().toISOString();

    sessionStorage.setItem(SUBMIT_TIME_KEY, time);

    lockAssessment();
    setSubmitted(true);
    setSubmittedAt(time);
    setRemaining(0);
    message.success(msg);
  }, []);

  const handleAutoSubmit = useCallback(async () => {
    if (submitted) return;

    stopTimer();

    await logAssessmentEvent({
      eventType: "timer_expired",
      questionId: null,
      metadata: {},
    });

    await forceSync();
    finalizeSubmission("Time expired. Assessment auto-submitted.");
  }, [submitted, stopTimer, forceSync, finalizeSubmission]);

  useEffect(() => {
    if (submitted) return;

    initTimer(APP_CONFIG.ASSESSMENT_DURATION_SECONDS);

    const tick = async () => {
      const seconds = getRemainingSeconds();
      if (seconds < 0) return;

      setRemaining(seconds);

      if (seconds === 0) {
        await handleAutoSubmit();
      }
    };

    tick();
    intervalRef.current = window.setInterval(tick, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [submitted, handleAutoSubmit]);

  const submit = async () => {
    if (submitted) return;

    stopTimer();

    await logAssessmentEvent({
      eventType: "submit",
      questionId: null,
      metadata: {},
    });

    await forceSync();
    finalizeSubmission("Assessment submitted.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
      }}
    >
      <Card style={{ width: 480 }}>
        <Space vertical size="large" style={{ width: "100%" }}>
          <Title level={3}>Assessment</Title>

          {!submitted ? (
            <Statistic
              title="Time Remaining"
              value={remaining}
              suffix="seconds"
            />
          ) : (
            <>
              <Text strong>Assessment Submitted</Text>
              <Text type="secondary">
                Submitted at:{" "}
                {submittedAt
                  ? new Date(submittedAt).toLocaleString()
                  : "-"}
              </Text>
            </>
          )}

          <Alert
            type="warning"
            message="Fullscreen is mandatory. Clipboard and tab activity are logged."
          />

          <Button
            type="primary"
            danger
            block
            disabled={submitted}
            onClick={submit}
          >
            {submitted ? "Assessment Submitted" : "Submit Assessment"}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default AssessmentPage;
