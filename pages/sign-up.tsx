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

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [notification, setNotification] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setNotification("Passwords do not match!");
    }

    const { data: userData, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setNotification("Failed to sign up. Please try again later.");
      return;
    }

    console.log(userData);
  });

  return (
    <>
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
                    Already have an account? Login
                  </Anchor>
                </Link>
                <Button type="submit">Sign Up</Button>
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
            Passwords do not match!
          </Notification>
        </Container>
      )}
    </>
  );
};

export default SignUp;
