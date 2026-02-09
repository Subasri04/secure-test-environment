import { Typography } from "antd";

const { Title, Text } = Typography;

const AssessmentShell = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Assessment Loaded</Title>
      <Text type="success">Chrome browser verified.</Text>
    </div>
  );
};

export default AssessmentShell;
