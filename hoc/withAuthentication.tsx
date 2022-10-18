import { useContext, ComponentType } from "react";
import { AuthContext } from "../context/AuthContext";
import { Container, Text } from "@mantine/core";
import Layout from "../components/Layout/Layout";

const withAuthentication =
  <T extends {}>(Component: ComponentType<T>) =>
  /* eslint-disable react/display-name */
  (props: T) => {
    const {
      state: { session },
      isLoading,
      isError,
    } = useContext(AuthContext);

    if (isLoading)
      return (
        <Layout>
          <Container size="xl">
            <Text size="xl" mt="xl">
              Loading...
            </Text>
          </Container>
        </Layout>
      );
    if (isError)
      return (
        <Layout>
          <Container size="xl">
            <Text size="xl" mt="xl">
              Failed to load page. Please try again later.
            </Text>
          </Container>
        </Layout>
      );

    if (!session) {
      return (
        <Layout>
          <Container size="xl">
            <Text size="xl" mt="xl">
              Not Authenticated. Please sign in.
            </Text>
          </Container>
        </Layout>
      );
    }

    return <Component {...props} />;
  };
export default withAuthentication;
