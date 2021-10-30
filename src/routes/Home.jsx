import { useState, useEffect } from 'react';
import { addDoc, collection, onSnapshot } from '@firebase/firestore';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';
import { dbService, storageService } from 'fBase';
import Sweet from 'components/Sweet';
import { v4 as uuid } from 'uuid';

const Home = ({ userObj }) => {
    const [sweet, setSweet] = useState('');
    const [sweets, setSweets] = useState([]);
    const [attachment, setAttachment] = useState('');

    useEffect(() => {
        onSnapshot(collection(dbService, 'sweet'), (snapshot) => {
            const newArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setSweets(newArray);
        });
    }, []);

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
        <>
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
            <div>
                {sweets.map((sweet) => (
                    <Sweet
                        key={sweet.id}
                        sweetObj={sweet}
                        isOwner={sweet.creator === userObj.uid}
                    />
                ))}
            </div>
        </>
    );
};

export default Home;
