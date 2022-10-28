import Layout from "../components/Layout/Layout";
import {
  Container,
  Table,
  Button,
  Modal,
  Title,
  TextInput,
  Textarea,
  Text,
  Group,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import withAuthentication from "../hoc/withAuthentication";
import { PeerReview, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

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
  const [peerReviews, setPeerReviews] = useState<PeerReview[] | null>(null);
  const [peerReviewsLoading, setPeerReviewsLoading] = useState(true);
  const [peerReviewsError, setPeerReviewsError] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: peerReviewsData, error: peerReviewsError } =
          await supabase.from("peer_reviews").select("*");

        if (peerReviewsError) throw Error;
        const peerReviews = peerReviewsData as PeerReview[];
        setPeerReviews(peerReviews);
      } catch {
        setPeerReviewsError(true);
      } finally {
        setPeerReviewsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  if (usersLoading || peerReviewsLoading) return <div>Loading...</div>;
  if (usersError || peerReviewsError) return <div>Error...</div>;

  const peers = users?.filter((peer) => peer.id !== user?.id);

  const onSubmit = handleSubmit(async (data) => {
    const {
      presentationScore,
      technicalScore,
      assistsPeersScore,
      documentationScore,
      comment,
    } = data;

    try {
      const { data: peerReviews, error: peerReviewsError } = await supabase
        .from("peer_reviews")
        .insert([
          {
            reviewer_id: user?.id,
            reviewee_id: peerReviewing?.id,
          },
        ])
        .select("*");

      if (peerReviewsError) throw peerReviewsError;

      const peerReviewsData = peerReviews[0] as unknown as PeerReview;

      const { error: peerReviewFieldsError } = await supabase
        .from("peer_review_fields")
        .insert([
          {
            peer_review_id: peerReviewsData.id,
            presentation_score: presentationScore,
            technical_score: technicalScore,
            assist_peers_score: assistsPeersScore,
            documentation_score: documentationScore,
            comment: comment,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (peerReviewFieldsError) throw peerReviewFieldsError;

      router.reload();
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
                const isReviewed = peerReviews?.find(
                  (peerReview) =>
                    peerReview.reviewer_id === user?.id &&
                    peerReview.reviewee_id === peer.id
                );

                return (
                  <tr key={peer.id}>
                    <td>{peer.email}</td>
                    <td>
                      {!isReviewed && (
                        <Button onClick={() => setPeerReviewing(peer)}>
                          Review
                        </Button>
                      )}

                      {isReviewed && (
                        <Group>
                          <Text color="green">Already Reviewed</Text>
                        </Group>
                      )}
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
