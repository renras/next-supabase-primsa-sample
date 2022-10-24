import Layout from "../components/Layout/Layout";
import { Container } from "@mantine/core";
import { Table, Title, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import styles from "../styles/Metrics.module.css";

type ApiUsageRecord = {
  id: number;
  api_name: string;
  called_at: Date;
  called_by: string;
};

const Metrics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [apiUsageRecords, setApiUsageRecords] = useState<any[]>([]);

  const supabase = useSupabaseClient();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: api_usage_records, error } = await supabase
          .from("api_usage_records")
          .select("*");

        if (error) throw error;

        mounted && setApiUsageRecords(api_usage_records);
      } catch (error) {
        mounted && setError(error);
      } finally {
        mounted && setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error... </div>;

  const path = "https://nlwiugzpdxrduoljokoz.supabase.co/api/v1/users";

  const userApiCallsCount = apiUsageRecords.filter(
    (record) => record.api_name === "create_user"
  );

  return (
    <Layout>
      <Container size="xl">
        {/* metrics */}
        <Container size="xs" mt="xl" className={styles.leftAlign} p={0}>
          <Title order={2} weight={600}>
            Metrics
          </Title>
          <Table mt="xs" withBorder withColumnBorders>
            <thead>
              <tr>
                <th>API Path</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Text color="blue">{path}</Text>
                </td>
                <td>{userApiCallsCount.length}</td>
              </tr>
            </tbody>
          </Table>
        </Container>

        {/* logs */}
        <Container size="md" mt="xl" className={styles.leftAlign} p={0}>
          <Title order={2} weight={600}>
            Logs
          </Title>
          <Table mt="xs" withBorder withColumnBorders>
            <thead>
              <tr>
                <th>API Name</th>
                <th>Called At</th>
                <th>Called By</th>
              </tr>
            </thead>
            <tbody>
              {apiUsageRecords.map((record: ApiUsageRecord) => (
                <tr key={record.id}>
                  <td>{record.api_name}</td>
                  <td>{record.called_at.toString()}</td>
                  <td>{record.called_by}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Container>
    </Layout>
  );
};

export default Metrics;
