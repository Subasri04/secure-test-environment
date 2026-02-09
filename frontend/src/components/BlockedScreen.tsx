import { Result } from "antd";

const BlockedScreen = () => {
  return (
    <Result
      status="warning"
      title="Unsupported Browser"
      subTitle="This assessment can only be taken using Google Chrome. Please reopen this link in Chrome."
    />
  );
};

export default BlockedScreen;
