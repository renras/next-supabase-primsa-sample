import { useContext, ComponentType } from "react";
import { AuthContext } from "../context/AuthContext";

const withAuthentication =
  <T extends {}>(Component: ComponentType<T>) =>
  /* eslint-disable react/display-name */
  (props: T) => {
    const {
      state: { session },
      isLoading,
      isError,
    } = useContext(AuthContext);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error...</div>;

    if (!session) {
      return <div>Not authenticated</div>;
    }

    return <Component {...props} />;
  };
export default withAuthentication;
