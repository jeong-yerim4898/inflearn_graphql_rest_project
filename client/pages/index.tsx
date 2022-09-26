import MsgList from "../components/MsgList";
import {fetcher} from "../queryClient";
import { GET_MESSAGES} from "../graphql/message.js";
import { GET_USERS} from "../graphql/user.js";

const Home = ({smgs,users}) => (
    <>
        <h1>SIMPLE SNS</h1>
        <MsgList smgs={smgs} users={users}/>
    </>
);

export const getServerSideProps = async () => {
    const smgs = await fetcher(GET_MESSAGES);
    const users = await fetcher(GET_USERS);
    return {
        props:{smgs,users}
    }
};

export default Home;