import Layout from "../components/Layout/Layout";
import { Container, Table, Button, Modal, Title } from "@mantine/core";
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
        title="Evaluate your peer"
      >
        Hello
      </Modal>
    </>
  );
};

export default withAuthentication(Reviews);
