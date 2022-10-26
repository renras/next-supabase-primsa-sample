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
import { useForm } from "react-hook-form";
import { useState } from "react";
import Layout from "../components/Layout/Layout";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineTwitter } from "react-icons/ai";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setNotification("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email: email,
          password: password,
        });

      if (signupError) throw signupError;

      const invokeFunction = async () => {
        const { error } = await supabase.functions.invoke("create-user");
        if (error) throw error;
      };

      await invokeFunction();

      const { error: apiRecordError } = await supabase
        .from("api_usage_records")
        .insert([
          {
            api_name: "create_user",
            called_at: new Date().toISOString(),
            called_by: signupData?.user?.id,
          },
        ]);

      if (apiRecordError) throw apiRecordError;

      router.push("/");
    } catch (error) {
      console.error(error);
      setNotification("Failed to create user. Please try again later.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      <Layout>
        <Container>
          <form onSubmit={onSubmit}>
            <Container size="xs" mt={48}>
              <Paper radius="md" p="xl" withBorder>
                <Title order={2} weight={500}>
                  Register
                </Title>

                <TextInput
                  label="Email"
                  type="email"
                  mt="lg"
                  {...register("email", { required: true })}
                />
                <TextInput
                  label="Password"
                  type="password"
                  mt="sm"
                  {...register("password", { required: true })}
                />
                <TextInput
                  label="Confirm Password"
                  type="password"
                  mt="sm"
                  {...register("confirmPassword", { required: true })}
                />

                <Group position="apart" mt="xl">
                  <Link href="/sign-in" passHref>
                    <Anchor component="a" color="dimmed" size="xs">
                      Already have an account? Sign In
                    </Anchor>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    Register
                  </Button>
                </Group>

                <Divider
                  label="Or register with"
                  labelPosition="center"
                  mt="xl"
                />

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
    </>
  );
};

export default SignUp;
