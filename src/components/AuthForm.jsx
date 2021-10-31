import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { authService } from 'fBase';

const inputStyle = {};

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [newAccount, setNewAccount] = useState(true);

    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            let data;
            if (newAccount) {
                data = await createUserWithEmailAndPassword(authService, email, password);
            } else {
                data = await signInWithEmailAndPassword(authService, email, password);
            }
        } catch (error) {
            setError('이미 존재하는 이메일 입니다.');
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={onChange}
                    required
                    className="authInput"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={onChange}
                    required
                    className="authInput"
                />
                <input
                    type="submit"
                    value={newAccount ? 'Create Account' : 'Log In'}
                    className="authInput authSubmit"
                />
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? 'Sign In' : 'Create Account'}
            </span>
        </>
    );
};

export default AuthForm;
