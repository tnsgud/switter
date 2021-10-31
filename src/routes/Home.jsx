import { useState, useEffect } from 'react';
import { collection, onSnapshot } from '@firebase/firestore';
import { dbService } from 'fBase';
import Sweet from 'components/Sweet';
import SweetFactory from 'components/SweetFactory';

const Home = ({ userObj }) => {
    const [sweets, setSweets] = useState([]);

    useEffect(() => {
        onSnapshot(collection(dbService, 'sweet'), (snapshot) => {
            const newArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setSweets(newArray);
        });
    }, []);

    return (
        <div className="container">
            <SweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {sweets.map((sweet) => (
                    <Sweet
                        key={sweet.id}
                        sweetObj={sweet}
                        isOwner={sweet.creator === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
