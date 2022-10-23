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

type UserData = {
  id: string;
  name?: string;
  email: string;
  image?: string;
};

const Profile = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
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

          setUserData(userData);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [user, supabase, user?.id]);

  const uploadAvatar = async () => {
    const avatar = getValues("avatar") as FileList;
    const file = avatar[0];

    if (!file) return;

    try {
      if (!user?.id) throw new Error("User not found");

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(`${user?.id}/avatar`, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(uploadData.path);

      //  update user where id = user.id
      const { error: updateError } = await supabase
        .from("users")
        .update({ image: publicUrl })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      setAvatarPreview(null);
      setUserData((prev: UserData) => ({
        ...prev,
        image: publicUrl,
      }));
    } catch (error) {
      alert("Error!");
    }
  };

  const updateAvatar = async () => {
    const avatar = getValues("avatar") as FileList;
    const file = avatar[0];

    if (!file) return;

    try {
      if (!user?.id) throw new Error("User not found");

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .update(`${user?.id}/avatar`, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(uploadData.path);

      //  update user where id = user.id
      const formattedPublicUrl = `${publicUrl}?t=${new Date().toISOString()}`;
      const { error: updateError } = await supabase
        .from("users")
        .update({ image: formattedPublicUrl })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      setAvatarPreview(null);
      setUserData((prev: UserData) => ({
        ...prev,
        image: formattedPublicUrl,
      }));
    } catch (error) {
      alert("Error!");
    }
  };

  const onSave = async () => {
    if (userData?.image) {
      updateAvatar();
    } else {
      uploadAvatar();
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
                src={avatarPreview || userData?.image}
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
