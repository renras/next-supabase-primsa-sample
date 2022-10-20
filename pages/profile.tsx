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
import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";

const Profile = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<any>(null);
  const { register, reset, getValues } = useForm();
  const supabase = useSupabaseClient();
  const user = useUser();

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleNotificationClose = () => {
    setAvatarPreview(null);
    reset((formValues) => ({
      ...formValues,
      avatar: null,
    }));
  };

  // useEffect get user data
  useEffect(() => {
    if (user) {
      (async () => {
        try {
          let { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) throw error;

          setUserImage(userData.image);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [user, supabase, user?.id]);

  const onSave = async () => {
    const avatar = getValues("avatar") as FileList;
    const file = avatar[0];

    if (!file) return;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(`avatar-${uuidv4()}`, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(uploadData.path);

      console.log(publicUrl);

      //  update user where id = user.id
      const { error: updateError } = await supabase
        .from("users")
        .update({ image: publicUrl })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      setAvatarPreview(null);
      setUserImage(publicUrl);
    } catch (error) {
      alert("Error!");
    }
  };

  return (
    <Layout>
      <Container size="xl" className={styles.container}>
        <Container fluid className={styles.background} />
        <Container className={styles.details}>
          <Group spacing="xl">
            <label htmlFor="profilePic" className={styles.avatar}>
              <Avatar
                src={avatarPreview || userImage}
                alt="profile picture"
                radius={100}
                size={128}
              />
              <input
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                id="profilePic"
                hidden
                {...register("avatar", {
                  onChange(event) {
                    handleFileInputChange(event);
                  },
                })}
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
            onClose={() => handleNotificationClose()}
          >
            <Group>
              <Text>Detected changes in your profile</Text>
              <Button onClick={() => onSave()}>Save</Button>
            </Group>
          </Notification>
        </Container>
      )}
    </Layout>
  );
};

export default withAuthentication(Profile);
