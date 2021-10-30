import { deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { dbService, storageService } from 'fBase';
import { useState } from 'react';

const Sweet = ({ sweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newSweet, setNewSweet] = useState(sweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm('삭제하시겠습니까?');

        if (ok) {
            await deleteDoc(doc(dbService, 'sweet', sweetObj.id));

            if (sweetObj.attachmentUrl !== '') {
                await deleteObject(ref(storageService, sweetObj.attachmentUrl));
            }
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewSweet(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService, 'sweet', sweetObj.id), { text: newSweet });
        setEditing(false);
    };

    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit} value="Update Sweet">
                        <input onChange={onChange} value={newSweet} required />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <div>
                        <h4>{sweetObj.text}</h4>
                        {sweetObj.attachmentUrl && (
                            <img
                                src={sweetObj.attachmentUrl}
                                width="50px"
                                height="50px"
                                alt="sweetImage"
                            />
                        )}
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
