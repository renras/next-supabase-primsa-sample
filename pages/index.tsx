import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Container, Button, Title, Table, Group } from "@mantine/core";
import { useState } from "react";

type Request = {
  status: string;
  message: string;
};

const Home: NextPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  const fetchApi = async () => {
    try {
      const data = (await axios.get("/api/rateLimiter")).data as Request;
      if (!data) return;

      setRequests((prev) => [...prev, data]);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Layout>
      <Container size="xs" mt={96}>
        <Group position="apart">
          <Title>Test Rate Limiter</Title>
          <Button onClick={() => fetchApi()}>Call Api</Button>
        </Group>
        <Table withBorder withColumnBorders mt="xl">
          <thead>
            <tr>
              <th>Status</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                <td>{request.status}</td>
                <td>{request.message}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </Layout>
  );
};

export default Home;
