import { ReactNode } from "react";
import { Header, Container, Title, Button, Group, Anchor } from "@mantine/core";
import Link from "next/link";
import styles from "./Layout.module.css";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
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
                  color="gray"
                  sx={(theme) => ({
                    transition: "0.3s",
                    "&:hover": {
                      color: theme.colors.blue,
                    },
                  })}
                >
                  Home
                </Anchor>
              </Link>

              {/* protected */}
              <Link href="/protected" passHref>
                <Anchor
                  component="a"
                  color="gray"
                  sx={(theme) => ({
                    transition: "0.3s",
                    "&:hover": {
                      color: theme.colors.blue,
                    },
                  })}
                >
                  Protected
                </Anchor>
              </Link>
            </Group>
          </nav>
          <Link href="/sign-in" passHref>
            <Button component="a" variant="default">
              Sign in
            </Button>
          </Link>
        </Container>
      </Header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
