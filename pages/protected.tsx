import Layout from "../components/Layout/Layout";
import { Container, Text } from "@mantine/core";
import withAuthentication from "../hoc/withAuthentication";

const Protected = () => {
  return (
    <Layout>
      <Container size="xl">
        <Text size="xl" mt="xl">
          Congrats! You have accessed this protected page!
        </Text>
      </Container>
    </Layout>
  );
};

export default withAuthentication(Protected);
