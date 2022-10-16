import {
  Container,
  Paper,
  Title,
  TextInput,
  Group,
  Anchor,
  Button,
} from "@mantine/core";
import Link from "next/link";

const SignIn = () => {
  return (
    <Container>
      <Container size="xs" mt={48}>
        <Paper radius="md" p="xl" withBorder>
          <Title order={2} weight={500}>
            Sign In
          </Title>

          <TextInput label="Email" mt="lg" />
          <TextInput label="Password" mt="sm" />
          <TextInput label="Confirm Password" mt="sm" />

          <Group position="apart" mt="xl">
            <Link href="/sign-up" passHref>
              <Anchor component="a" color="dimmed" size="xs">
                Don&apos;t have an account yet? Sign up
              </Anchor>
            </Link>
            <Button type="submit">Sign In</Button>
          </Group>
        </Paper>
      </Container>
    </Container>
  );
};

export default SignIn;
