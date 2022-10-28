import { ReactNode, useState } from "react";
import {
  Header,
  Container,
  Title,
  Button,
  Group,
  Anchor,
  Text,
  Notification,
} from "@mantine/core";
import Link from "next/link";
import styles from "./Layout.module.css";
import { useRouter } from "next/router";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setNotification("Failed to sign out. Please try again later.");
    }
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_IN") {
          try {
            const { error } = await supabase.functions.invoke("create-user");
            if (error) throw error;
          } catch (error) {
            console.error(error);
          }
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase, user?.id]);

  return (
    <div>
      <Header height={64} className={styles.header}>
        <Container size="xl" className={styles.header__content}>
          <Title order={1}>Wassup</Title>
          <nav>
            <Group>
              {/* home */}
              <Link href="/" passHref>
                <Anchor
                  component="a"
                  color={router.pathname === "/" ? "blue" : "gray"}
                  sx={(theme) => ({
                    transition: "0.3s",
                    "&:hover": {
                      color: theme.colors.blue,
                    },
                  })}
                  underline={false}
                >
                  Home
                </Anchor>
              </Link>

              {/* profile */}
              <Link href="/profile" passHref>
                <Anchor
                  component="a"
                  color={router.pathname === "/profile" ? "blue" : "gray"}
                  sx={(theme) => ({
                    transition: "0.3s",
                    "&:hover": {
                      color: theme.colors.blue,
                    },
                  })}
                  underline={false}
                >
                  Profile
                </Anchor>
              </Link>

              {/* metrics */}
              <Link href="/metrics" passHref>
                <Anchor
                  component="a"
                  color={router.pathname === "/metrics" ? "blue" : "gray"}
                  sx={(theme) => ({
                    transition: "0.3s",
                    "&:hover": {
                      color: theme.colors.blue,
                    },
                  })}
                  underline={false}
                >
                  Metrics
                </Anchor>
              </Link>

              {/* reviews */}
              <Link href="/reviews" passHref>
                <Anchor
                  component="a"
                  color={router.pathname === "/reviews" ? "blue" : "gray"}
                  sx={(theme) => ({
                    transition: "0.3s",
                    "&:hover": {
                      color: theme.colors.blue,
                    },
                  })}
                  underline={false}
                >
                  Reviews
                </Anchor>
              </Link>
            </Group>
          </nav>
          {user && (
            <Group>
              <Text>{user.email}</Text>
              <Button
                color="red"
                variant="outline"
                onClick={() => handleSignOut()}
              >
                Sign Out
              </Button>
            </Group>
          )}

          {!user && (
            <Link href="/sign-in" passHref>
              <Button component="a" variant="default">
                Sign In
              </Button>
            </Link>
          )}
        </Container>
      </Header>
      <main>{children}</main>
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
    </div>
  );
};

export default Layout;
