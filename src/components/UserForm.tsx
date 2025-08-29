import { useState, type FormEvent } from 'react';
import type { CreateUserRequest } from '../types';

interface UserFormProps {
  onSubmit: (user: CreateUserRequest) => void;
  isLoading: boolean;
}

export function UserForm({ onSubmit, isLoading }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    
    onSubmit({ name: name.trim(), email: email.trim() });
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h3>Add New User</h3>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={isLoading || !name.trim() || !email.trim()}>
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}