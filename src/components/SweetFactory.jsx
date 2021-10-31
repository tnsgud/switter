import { v4 as uuid } from 'uuid';
import { useState } from 'react';
import { dbService, storageService } from 'fBase';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';
import { addDoc, collection } from '@firebase/firestore';

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

        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };

        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment('');

    return (
        <form onSubmit={onSubmit}>
            <input
                value={sweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
            />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Sweet" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" alt="selectedImage" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
    );
};

export default SweetFactory;
