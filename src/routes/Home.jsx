import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from '@firebase/firestore';
import { dbService } from 'fBase';

const Home = ({ userObj }) => {
    const [sweet, setSweet] = useState('');
    const [sweets, setSweets] = useState([]);

    useEffect(() => {
        onSnapshot(collection(dbService, 'sweet'), (snapshot) => {
            snapshot.docs.map((doc) => {
                console.log(doc.data());
            });
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
                <input type="submit" value="Sweet" />
            </form>
            <div>
                {sweets.map((sweet) => (
                    <div key={sweet.id}>
                        <h4>{sweet.text}</h4>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Home;
