import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import fetcher from "../fetcher";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const UserIds = ["yeriel", "landy"];


const MsgList = ({smgs, users}) => {
    const {query} = useRouter();
    const userId = query.userId || query.userid || "";
    const [msgs, setMsgs] = useState(smgs);
    const [editingId, setEditingId] = useState(null);
    const [hasNext, setHasNext] = useState(true);
    const fetchMoreEl = useRef(null);
    const intersecting = useInfiniteScroll(fetchMoreEl);

    const onCreate = async text => {
        const newMsg = await fetcher('post', '/messages', {text, userId});
        if (!newMsg) throw Error('something wrong!!')
        setMsgs(msgs => ([newMsg, ...msgs]));
    };

    const onUpdate = async (text, id) => {
        const newMsg = await fetcher('put', `/messages/${id}`, {text, userId});
        if (!newMsg) throw Error('something wrong!!')
        setMsgs(msgs => {
            const targetIndex = msgs.findIndex(msg => msg.id === id);
            if (targetIndex < 0) return;
            const newMsgs = [...msgs];
            newMsgs.splice(targetIndex, 1, newMsg);
            return newMsgs;
        });
        doneEdit();
    };

    const doneEdit = () => setEditingId(null);

    const getMessages = async () => {
        const newMsgs = await fetcher('get', '/messages', {params: {cursor: msgs[msgs.length - 1]?.id || ''}});
        if (newMsgs.length === 0) {
            setHasNext(false);
            return
        }
        setMsgs(msgs => [...msgs, ...newMsgs]);
    };


    useEffect(() => {
        if (intersecting && hasNext) getMessages();
    }, [intersecting])


    const onDelete = async (id) => {
        const receviedId = await fetcher('delete', `/messages/${id}`, {params: {userId}})
        setMsgs(msgs => {
            const targetIndex = msgs.findIndex(msg => msg.id === receviedId + "");
            if (targetIndex < 0) return;

            const newMsgs = [...msgs];
            newMsgs.splice(targetIndex, 1);
            return newMsgs;
        });
    }

    return (
        <>
            {userId && < MsgInput mutate={onCreate}/>}
            <ul className={"messages"}>{
                msgs.map(x => <MsgItem key={x.id}
                                       onUpdate={onUpdate}
                                       onDelete={() => onDelete(x.id)}
                                       startEdit={() => setEditingId(x.id)}
                                       isEditing={editingId === x.id} {...x}
                                       myId={userId}
                                       user={users[x.userId]}/>)
            }</ul>
            <div ref={fetchMoreEl}></div>
        </>
    )
};

export default MsgList;