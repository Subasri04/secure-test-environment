import { Layout } from "antd";
import BootstrapGuard from "./app/BootstrapGuard";

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <BootstrapGuard />
    </Layout>
  )
}

export default App;
