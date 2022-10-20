import { ComponentType } from "react";
import { Container, Text } from "@mantine/core";
import Layout from "../components/Layout/Layout";
import { useUser } from "@supabase/auth-helpers-react";

const withAuthentication =
  <T extends {}>(Component: ComponentType<T>) =>
  /* eslint-disable react/display-name */
  (props: T) => {
    const user = useUser();

    // if (isLoading)
    //   return (
    //     <Layout>
    //       <Container size="xl">
    //         <Text size="xl" mt="xl">
    //           Loading...
    //         </Text>
    //       </Container>
    //     </Layout>
    //   );

    // if (isError)
    //   return (
    //     <Layout>
    //       <Container size="xl">
    //         <Text size="xl" mt="xl">
    //           Failed to load page. Please try again later.
    //         </Text>
    //       </Container>
    //     </Layout>
    //   );

    if (!user) {
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
