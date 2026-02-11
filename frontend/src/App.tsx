import { Layout } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BrowserCheck from "./pages/BrowserCheck";
import AssessmentPage from "./pages/AssessmentPage";
import EmployerAuditPage from "./pages/EmployerAuditPage";
import AssessmentLogsDashboard from "./pages/AssessmentLogsDashboard";

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BrowserCheck />} />
          <Route path="/assessment/:employee_id" element={<AssessmentPage />} />
          <Route path="/assessment-logs" element={<AssessmentLogsDashboard />} />
          <Route path="/audit/:employee_id" element={<EmployerAuditPage />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
