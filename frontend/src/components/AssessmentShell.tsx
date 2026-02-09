import { Typography, Button, Card, Alert, Space } from "antd";
import {
  FullscreenOutlined,
  LockOutlined,
} from "@ant-design/icons";

import { useTabFocus } from "../hooks/useTabFocus";
import { useFullscreen } from "../hooks/useFullscreen";
import { useClipboardGuard } from "../hooks/useClipboardGuard";
import EventDebugViewer from "./EventDebugViewer";

const { Title, Text } = Typography;

const AssessmentShell = () => {
  useTabFocus();
  useFullscreen();
  useClipboardGuard();

  const enterFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fa",
      }}
    >
      <Card
        style={{ width: 520 }}
        bordered={false}
      >
        <Space vertical size="large" style={{ width: "100%" }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            Assessment Environment
          </Title>

          <Text type="success">
            Chrome browser verified
          </Text>

          <Alert
            message="Fullscreen Required"
            description="This assessment must be taken in fullscreen mode. Exiting fullscreen or switching tabs will be recorded."
            type="warning"
            showIcon
            icon={<LockOutlined />}
          />

          <Button
            type="primary"
            size="large"
            icon={<FullscreenOutlined />}
            block
            onClick={enterFullscreen}
          >
            Enter Fullscreen to Continue
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default AssessmentShell;
