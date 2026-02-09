import { Typography, Button, Space } from "antd";
import { useTabFocus } from "../hooks/useTabFocus";
import { useFullscreen } from "../hooks/useFullscreen";
import { useClipboardGuard } from "../hooks/useClipboardGuard";
import { Content } from "antd/es/layout/layout";

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
        <Content style={{ padding: '15px' }}>
            <Space vertical size="large">
                <Title level={2}>Assessment Loaded</Title>
                <Text type="success">Chrome browser verified.</Text>

                <Button type="primary" onClick={enterFullscreen}>
                    Enter Fullscreen
                </Button>
            </Space>
        </Content>
    );
};

export default AssessmentShell;
