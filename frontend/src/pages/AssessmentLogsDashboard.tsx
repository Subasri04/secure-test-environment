import { useEffect, useMemo, useState } from "react";
import { Table, Typography, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../config/appConfig";

const { Title } = Typography;

interface AssessmentLog {
  employeeId: string;
  attemptId: string;
}

interface EmployeeSummary {
  employeeId: string;
  attempts: number;
}

const AssessmentLogsDashboard = () => {
  const [logs, setLogs] = useState<AssessmentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    fetch(`${APP_CONFIG.API_BASE_URL}/assessment-logs`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch assessment logs");
        }
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          setLogs(data);
        }
      })
      .catch(err => {
        console.error("Error loading assessment logs:", err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const employees: EmployeeSummary[] = useMemo(() => {
    const map: Record<string, Set<string>> = {};

    logs.forEach(log => {
      if (!map[log.employeeId]) {
        map[log.employeeId] = new Set();
      }
      map[log.employeeId].add(log.attemptId);
    });

    return Object.entries(map).map(([employeeId, attempts]) => ({
      employeeId,
      attempts: attempts.size,
    }));
  }, [logs]);

  return (
    <div style={{ padding: 32 }}>
      <Title level={2}>Assessment Logs</Title>
      <Table<EmployeeSummary>
        loading={loading}
        rowKey="employeeId"
        dataSource={employees}
        pagination={{ pageSize: 10 }}
        columns={[
          {
            title: "Employee ID",
            dataIndex: "employeeId",
          },
          {
            title: "Attempts",
            dataIndex: "attempts",
            render: (count: number) => (
              <Tag color={count > 1 ? "orange" : "blue"}>
                {count}
              </Tag>
            ),
          },
          {
            title: "Action",
            render: (_, record) => (
              <a onClick={() => navigate(`/audit/${record.employeeId}`)}>
                View Audit
              </a>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AssessmentLogsDashboard;
