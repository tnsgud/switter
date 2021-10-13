import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc } from '@firebase/firestore';
import { dbService } from 'fBase';

const Home = () => {
    const [sweet, setSweet] = useState('');
    const [sweets, setSweets] = useState([]);

    const getSweets = async () => {
        const dbSweets = await getDocs(collection(dbService, 'sweet'));
        dbSweets.forEach((doc) => {
            const sweetObject = { ...doc.data(), id: doc.id };
            setSweets((prev) => [sweetObject, ...prev]);
        });
    };

    useEffect(() => {
        getSweets();
    }, []);

    console.log(sweets);

    const onSubmit = async (event) => {
        event.preventDefault();
        const docRef = await addDoc(collection(dbService, 'sweet'), {
            text: sweet,
            createAt: Date.now(),
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
    );
};

export default Home;
