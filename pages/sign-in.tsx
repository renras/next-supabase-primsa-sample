import {
  Container,
  Paper,
  Title,
  TextInput,
  Group,
  Anchor,
  Button,
  Notification,
  Divider,
} from "@mantine/core";
import Link from "next/link";
import Layout from "../components/Layout/Layout";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineTwitter } from "react-icons/ai";

type FormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();
  const supabase = useSupabaseClient();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { email, password } = data;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/");
    } catch {
      setNotification("Failed to sign in. Please try again later.");
    }
  });

  return (
    <Layout>
      <Container>
        <form onSubmit={onSubmit}>
          <Container size="xs" mt={48}>
            <Paper radius="md" p="xl" withBorder>
              <Title order={2} weight={500}>
                Sign In
              </Title>

              <TextInput
                label="Email"
                mt="lg"
                type="email"
                {...register("email", { required: true })}
              />

              <TextInput
                label="Password"
                type="password"
                mt="sm"
                {...register("password", { required: true })}
              />

              <Group position="apart" mt="xl">
                <Link href="/register" passHref>
                  <Anchor component="a" color="dimmed" size="xs">
                    Don&apos;t have an account yet? Register
                  </Anchor>
                </Link>
                <Button type="submit">Sign In</Button>
              </Group>

              <Divider label="Or sign in with" labelPosition="center" mt="xl" />

              <Group grow mb="md" mt="xl">
                <Button
                  radius="xl"
                  variant="default"
                  leftIcon={<FcGoogle size={20} />}
                >
                  Google
                </Button>
                <Button
                  radius="xl"
                  variant="default"
                  leftIcon={<AiOutlineTwitter size={20} color="#1DA1F2" />}
                >
                  Twitter
                </Button>
              </Group>
            </Paper>
          </Container>
        </form>
      </Container>
      {notification && (
        <Container size={384}>
          <Notification
            color="red"
            className="notification"
            onClose={() => setNotification(null)}
          >
            {notification}
          </Notification>
        </Container>
      )}
    </Layout>
  );
};

export default SignIn;
