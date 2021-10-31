import { deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { dbService, storageService } from 'fBase';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

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
        <div className="sweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} value="Update Sweet" className="container sweetEdit">
                        <input
                            onChange={onChange}
                            value={newSweet}
                            required
                            className="formInput"
                        />
                        <input type="submit" value="Update Sweet" className="formBtn" />
                    </form>

                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>
                </>
            ) : (
                <>
                    <h4>{sweetObj.text}</h4>
                    {sweetObj.attachmentUrl && (
                        <img src={sweetObj.attachmentUrl} alt="sweetImage" />
                    )}
                    {isOwner && (
                        <div class="sweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Sweet;
