import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Timeline,
  Typography,
  Tag,
  Space,
  Spin,
  Divider,
  Alert,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  EyeInvisibleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { APP_CONFIG } from "../config/appConfig";

const { Title, Text } = Typography;

interface AuditLog {
  id: string;
  attemptId: string;
  eventType: string;
  timestamp: string;
}

const VIOLATION_EVENTS = [
  "copy_attempt",
  "cut_attempt",
  "paste_attempt",
  "tab_blur",
  "fullscreen_exited",
];

function humanizeEvent(event: string): string {
  switch (event) {
    case "copy_attempt":
      return "Copy attempt detected";
    case "cut_attempt":
      return "Cut attempt detected";
    case "paste_attempt":
      return "Paste attempt detected";
    case "tab_blur":
      return "Tab switched away";
    case "tab_focus":
      return "Returned to assessment tab";
    case "fullscreen_entered":
      return "Entered fullscreen";
    case "fullscreen_exited":
      return "Exited fullscreen";
    case "timer_started":
      return "Assessment timer started";
    case "timer_expired":
      return "Assessment timer expired";
    case "submit":
      return "Assessment submitted";
    default:
      return event;
  }
}

function getEventIcon(event: string) {
  if (event === "submit") return <CheckCircleOutlined />;
  if (event === "timer_expired") return <ClockCircleOutlined />;
  if (VIOLATION_EVENTS.includes(event)) return <CopyOutlined />;
  return <EyeInvisibleOutlined />;
}

function getEventColor(event: string) {
  if (event === "submit") return "green";
  if (VIOLATION_EVENTS.includes(event)) return "red";
  return "blue";
}

const EmployerAuditPage = () => {
  const { employee_id } = useParams<{ employee_id: string }>();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${APP_CONFIG.API_BASE_URL}/assessment-logs/${employee_id}`)
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
  }, [employee_id]);

  const attempts = useMemo(() => {
    const grouped: Record<string, AuditLog[]> = {};
    logs.forEach(log => {
      grouped[log.attemptId] = grouped[log.attemptId] || [];
      grouped[log.attemptId].push(log);
    });
    return grouped;
  }, [logs]);

  if (loading) {
    return <Spin fullscreen />;
  }

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
      <Title level={2}>Assessment Audit</Title>
      <Text type="secondary">Employee ID: {employee_id}</Text>
      <Divider />
      {Object.entries(attempts).map(([attemptId, events], index) => {
        const sorted = events.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime()
        );

        const violations = sorted.filter(e =>
          VIOLATION_EVENTS.includes(e.eventType)
        );

        const submitted = sorted.some(e => e.eventType === "submit");

        return (
          <Card
            key={attemptId}
            style={{ marginBottom: 32 }}
            title={`Attempt ${index + 1}`}
            extra={
              <Tag color={submitted ? "green" : "red"}>
                {submitted ? "Submitted" : "Incomplete"}
              </Tag>
            }
          >
            <Space vertical size="middle" style={{ width: "100%" }}>
              <Text>
                <strong>Attempt ID:</strong> {attemptId}
              </Text>

              {violations.length > 0 && (
                <Alert
                  type="warning"
                  showIcon
                  icon={<WarningOutlined />}
                  message={`Violations detected: ${violations.length}`}
                />
              )}
              <Timeline>
                {sorted.map(event => (
                  <Timeline.Item
                    key={event.id}
                    dot={getEventIcon(event.eventType)}
                    color={getEventColor(event.eventType)}
                  >
                    <Space direction="vertical" size={0}>
                      <Text strong>
                        {humanizeEvent(event.eventType)}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(event.timestamp).toLocaleString()}
                      </Text>
                    </Space>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Space>
          </Card>
        );
      })}
    </div>
  );
};

export default EmployerAuditPage;
