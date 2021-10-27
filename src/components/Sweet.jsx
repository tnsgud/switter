import { deleteDoc, doc } from '@firebase/firestore';
import { dbService } from 'fBase';
import { useState } from 'react';

const Sweet = ({ sweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newSweet, setNewSweet] = useState(sweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm('삭제하시겠습니까?');

        if (ok) {
            await deleteDoc(doc(dbService, 'sweet', sweetObj.id));
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    return (
        <div>
            {editing ? (
                <>
                    <form action=""></form>
                </>
            ) : (
                <>
                    <div>
                        <h4>{sweetObj.text}</h4>
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Sweet</button>
                                <button onClick={toggleEditing}>Edit Sweet</button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Sweet;
