import {
  Container,
  Paper,
  Title,
  TextInput,
  Group,
  Anchor,
  Button,
  Notification,
} from "@mantine/core";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Layout from "../components/Layout/Layout";
import { useRouter } from "next/router";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setNotification("Passwords do not match!");
      return;
    }

    try {
      const { error: signupError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signupError) throw signupError;

      const invokeFunction = async () => {
        const { error } = await supabase.functions.invoke("create-user");
        if (error) throw error;
      };
      await invokeFunction();
      router.push("/");
    } catch (error) {
      setNotification("Failed to create user. Please try again later.");
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
                  <Button type="submit">Register</Button>
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
