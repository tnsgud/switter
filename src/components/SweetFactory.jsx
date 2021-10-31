import { v4 as uuid } from 'uuid';
import { useState } from 'react';
import { dbService, storageService } from 'fBase';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';
import { addDoc, collection } from '@firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const SweetFactory = ({ userObj }) => {
    const [sweet, setSweet] = useState('');
    const [attachment, setAttachment] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = '';

        if (attachment !== '') {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuid()}`);

            await uploadString(attachmentRef, attachment, 'data_url');

            attachmentUrl = await getDownloadURL(attachmentRef);
        }

        await addDoc(collection(dbService, 'sweet'), {
            text: sweet,
            createAt: Date.now(),
            creator: userObj.uid,
            attachmentUrl,
        });

        setSweet('');
        setAttachment('');
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: { value },
        } = event;
        setSweet(value);
    };

    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();

        if (Boolean(theFile)) {
            reader.onloadend = (finishedEvent) => {
                const {
                    currentTarget: { result },
                } = finishedEvent;
                setAttachment(result);
            };
        }
    };

    const onClearAttachment = () => setAttachment('');

    return (
        <form onSubmit={onSubmit} className="factoryFor">
            <div className="factoryInput__container">
                <input
                    value={sweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                    className="factoryInput__input"
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label for="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        alt="selectedImage"
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
};

export default SweetFactory;
