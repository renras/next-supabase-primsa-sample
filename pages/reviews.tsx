import Layout from "../components/Layout/Layout";
import { Container } from "@mantine/core";
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const Reviews = () => {
  const supabase = useSupabaseClient();
  const [usersError, setUsersError] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [users, setUsers] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: users, error } = await supabase.from("users").select("*");

        if (error) throw error;

        mounted && setUsers(users);
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

  console.log(users);

  return (
    <Layout>
      <Container size="xl">reviews</Container>
    </Layout>
  );
};

export default Reviews;
