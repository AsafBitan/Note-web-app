import React, { useState } from 'react';
import styles from "../page.module.css";

const CreateUserForm:React.FC<{ onSubmit: (name: string, email: string, username: string, password: string) => void;}> = ({ onSubmit }) =>{
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, username, password);
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    console.log({ name, email, username });
  };
  
    return (
      <form name="create_user_form" onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input name="create_user_form_name" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
          </label>
        </div>
        <div>
          <label>
            Email:
            <input name="create_user_form_email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </label>
        </div>
        <div>
          <label>
            Username:
            <input name="create_user_form_username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input name="create_user_form_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>
        <button name="create_user_form_create_user" type="submit">
          Create User
        </button>
      </form>
    );
  };
  
  export default CreateUserForm;