import { useEffect } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Space,
  Alert,
} from "antd";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../config/appConfig";

const { Title, Text } = Typography;

function detectBrowser() {
  const ua = navigator.userAgent;
  const isChrome =
    /Chrome/.test(ua) && !/Edg/.test(ua) && !/OPR/.test(ua);

  const versionMatch = ua.match(/Chrome\/(\d+)/);

  return {
    isChrome,
    name: isChrome ? "Google Chrome" : "Unsupported",
    version: versionMatch ? versionMatch[1] : "unknown",
  };
}

const BrowserCheck = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const browser = detectBrowser();
  const allowed = browser.isChrome;

  useEffect(() => {
    fetch(`${APP_CONFIG.API_BASE_URL}/browser-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: "UNKNOWN",
        eventType: allowed ? "access_allowed" : "access_blocked",
        browserName: browser.name,
        browserVersion: browser.version,
      }),
    }).catch(console.error);
  }, [allowed, browser.name, browser.version]);

  if (allowed === null) return null;

  if (!allowed) {
    return (
      <div style={containerStyle}>
        <Card style={cardStyle}>
          <Alert
            type="error"
            showIcon
            message="Unsupported Browser"
            description="This assessment can only be taken using Google Chrome."
          />
        </Card>
      </div>
    );
  }

  const onFinish = (values: { employeeId: string }) => {
    navigate(`/assessment/${values.employeeId}`);
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              Secure Assessment Portal
            </Title>
            <Text type="secondary">
              Browser verified. Please enter your Employee ID to continue.
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Employee ID"
              name="employeeId"
              rules={[
                { required: true, message: "Employee ID is required" },
                { min: 3, message: "Employee ID must be at least 3 characters" },
              ]}
            >
              <Input placeholder="e.g. emp10" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
            >
              Start Assessment
            </Button>
          </Form>

          <DividerWithText text="Admin / Reviewer" />

          <Button
            type="default"
            block
            onClick={() => navigate("/assessment-logs")}
          >
            View Assessment Logs
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default BrowserCheck;

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f7fa",
};

const cardStyle: React.CSSProperties = {
  width: 420,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  borderRadius: 8,
};

const DividerWithText = ({ text }: { text: string }) => (
  <div style={{ textAlign: "center", color: "#999", fontSize: 12 }}>
    {text}
  </div>
);
