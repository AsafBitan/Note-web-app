import React, { useState } from 'react';
import styles from "../page.module.css";

const LoginForm:React.FC<{ onSubmit: (username: string, password: string) => void;}> = ({ onSubmit }) =>{

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit( username, password);
    setUsername('');
    setPassword('');
    console.log({ username, password });
  };
  
    return (
      <form name="login_form" onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input name="login_form_username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input name="login_form_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>
        <button name="login_form_login" type="submit">
          Login
        </button>
      </form>
    );
  };
  
  export default LoginForm;