import Layout from "../components/Layout/Layout";
import { Container, Avatar, Group, Title } from "@mantine/core";
import withAuthentication from "../hoc/withAuthentication";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  return (
    <Layout>
      <Container size="xl" className={styles.container}>
        <Container fluid className={styles.background} />
        <Container className={styles.details}>
          <Group spacing="xl">
            <Avatar
              src="/images/avatar.jpg"
              alt="profile picture"
              radius={100}
              size={128}
              className={styles.avatar}
            />
            <Title>Bowl Cut</Title>
          </Group>
        </Container>
      </Container>
    </Layout>
  );
};

export default withAuthentication(Profile);
