import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { authService, dbService } from 'fBase';
import { collection, getDocs, query, where, orderBy } from '@firebase/firestore';

const Profile = ({ userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history.push('/');
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };

    const getMySweets = async () => {
        const docQuery = query(
            collection(dbService, 'sweet'),
            where('creator', '==', userObj.uid),
            orderBy('createAt', 'asc')
        );
        const sweets = await getDocs(docQuery);

        sweets.docs.map((doc) => {
            console.log(doc.data());
        });
    };

    useEffect(() => {
        getMySweets();
    }, []);

    const onSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="Display name"
                    onChange={onChange}
                    value={newDisplayName}
                />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;
