import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from '@firebase/firestore';
import { dbService } from 'fBase';
import Sweet from 'components/Sweet';

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
        await addDoc(collection(dbService, 'sweet'), {
            text: sweet,
            createAt: Date.now(),
            creator: userObj.uid,
        });

        setSweet('');
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
                        <img src={attachment} width="50px" height="50px" />
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
