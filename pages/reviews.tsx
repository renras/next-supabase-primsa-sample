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
import { useForm } from "react-hook-form";

type FormData = {
  presentationScore: number;
  technicalScore: number;
  assistsPeersScore: number;
  documentationScore: number;
  comment: string;
};

const Reviews = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [usersError, setUsersError] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [users, setUsers] = useState<User[] | null>(null);
  const { register, handleSubmit } = useForm<FormData>();
  const [peerReviewing, setPeerReviewing] = useState<User | null>(null);

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { error: peerReviewsError } = await supabase
        .from("peer_reviews")
        .insert([
          {
            reviewer_id: user?.id,
            reviewee_id: peerReviewing?.id,
            fields: data,
          },
        ]);

      if (peerReviewsError) throw peerReviewsError;
    } catch (error) {
      console.error(error);
    } finally {
      setPeerReviewing(null);
    }
  });

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
              {peers?.map((peer) => {
                return (
                  <tr key={peer.id}>
                    <td>{peer.email}</td>
                    <td>
                      <Button onClick={() => setPeerReviewing(peer)}>
                        Review
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      </Layout>

      <Modal
        opened={peerReviewing !== null}
        onClose={() => setPeerReviewing(null)}
        title={
          <Title order={2} weight="600">
            Review your peer
          </Title>
        }
      >
        <form onSubmit={onSubmit}>
          <TextInput
            label="Presentation Score"
            type="number"
            mt="xl"
            {...register("presentationScore", { min: 0, max: 5 })}
          />
          <TextInput
            label="Technical Score"
            type="number"
            mt="xs"
            {...register("technicalScore", { min: 0, max: 5 })}
          />
          <TextInput
            label="Assists Peers Score"
            type="number"
            mt="xs"
            {...register("assistsPeersScore", { min: 0, max: 5 })}
          />
          <TextInput
            label="Documentation Score"
            type="number"
            mt="xs"
            {...register("documentationScore", { min: 0, max: 5 })}
          />

          <Textarea
            label="Comment"
            mt="xl"
            {...register("comment", { min: 0, max: 5 })}
          />

          <Button fullWidth mt={32} size="md" type="submit">
            Add Review
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default withAuthentication(Reviews);
