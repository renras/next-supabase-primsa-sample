import Layout from "../components/Layout/Layout";
import {
  Container,
  Table,
  Button,
  Modal,
  Title,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import withAuthentication from "../hoc/withAuthentication";
import { User } from "../types/User";

const Reviews = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [usersError, setUsersError] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [users, setUsers] = useState<User[] | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: users, error } = await supabase.from("users").select("*");

        if (error) throw error;

        mounted && setUsers(users as unknown as User[]);
      } catch (error) {
        console.error(error);
        mounted && setUsersError(true);
      } finally {
        mounted && setUsersLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  if (usersLoading) return <div>Loading...</div>;
  if (usersError) return <div>Error...</div>;

  const peers = users?.filter((peer) => peer.id !== user?.id);

  return (
    <>
      <Layout>
        <Container size="xl">
          <Title id="peers-table-header" weight="600" mt={64}>
            Peers
          </Title>
          <Table mt="xl" aria-labelledby="peers-table-header">
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {peers?.map((peer) => (
                <tr key={peer.id}>
                  <td>{peer.email}</td>
                  <td>
                    <Button onClick={() => setIsReviewing(true)}>Review</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Layout>

      <Modal
        opened={isReviewing}
        onClose={() => setIsReviewing(false)}
        title={
          <Title order={2} weight="600">
            Review your peer
          </Title>
        }
      >
        <TextInput label="Presentation Score" type="number" mt="xl" />
        <TextInput label="Technical Score" type="number" mt="xs" />
        <TextInput label="Assists Peers Score" type="number" mt="xs" />
        <TextInput label="Documentation Score" type="number" mt="xs" />

        <Textarea label="Comment" mt="xl" />

        <Button fullWidth mt={32} size="md">
          Add Review
        </Button>
      </Modal>
    </>
  );
};

export default withAuthentication(Reviews);
