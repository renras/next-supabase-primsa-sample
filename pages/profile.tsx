import Layout from "../components/Layout/Layout";
import {
  Container,
  Avatar,
  Group,
  Title,
  Notification,
  Text,
  Button,
} from "@mantine/core";
import withAuthentication from "../hoc/withAuthentication";
import styles from "../styles/Profile.module.css";
import { ChangeEvent, useState } from "react";

const Profile = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }

    e.target.value = "";
  };

  return (
    <Layout>
      <Container size="xl" className={styles.container}>
        <Container fluid className={styles.background} />
        <Container className={styles.details}>
          <Group spacing="xl">
            <label htmlFor="profilePic" className={styles.avatar}>
              <Avatar
                src={avatarPreview || "/images/avatar.jpg"}
                alt="profile picture"
                radius={100}
                size={128}
              />
              <input
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                id="profilePic"
                hidden
                onChange={handleFileInputChange}
              />
            </label>

            <Title>Bowl Cut</Title>
          </Group>
        </Container>
      </Container>
      {avatarPreview && (
        <Container size={384}>
          <Notification
            color="yellow"
            className="notification"
            onClose={() => setAvatarPreview(null)}
          >
            <Group>
              <Text>Detected changes in your profile</Text>
              <Button>Save</Button>
            </Group>
          </Notification>
        </Container>
      )}
    </Layout>
  );
};

export default withAuthentication(Profile);
