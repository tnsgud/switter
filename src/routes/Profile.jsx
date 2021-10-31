import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { authService, dbService } from 'fBase';
import { collection, getDocs, query, where, orderBy } from '@firebase/firestore';
import { updateProfile } from '@firebase/auth';

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

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(userObj, { displayName: newDisplayName });
            window.location.reload();
        }
    };

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    type="text"
                    placeholder="Display name"
                    onChange={onChange}
                    value={newDisplayName}
                    className="formInput"
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};

export default Profile;
