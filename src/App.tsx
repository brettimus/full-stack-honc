import { useCallback, useEffect, useState } from 'react';
import { apiClient } from './api';
import { ApiStatus } from './components/ApiStatus';
import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';
import type { CreateUserRequest, User } from './types';
import './App.css';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await apiClient.getUsers();
      setUsers(userData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      setIsCreating(true);
      setError(null);
      const newUser = await apiClient.createUser(userData);
      setUsers((prev) => [...prev, newUser]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to create user'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setDeletingId(id);
      setError(null);
      await apiClient.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete user'
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🪿 HONC User Management</h1>
        <p>React SPA + Cloudflare Worker with D1 Database</p>
      </header>

      <main className="app-main">
        <ApiStatus />

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button type="button" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        <div className="app-content">
          <div className="form-section">
            <UserForm onSubmit={handleCreateUser} isLoading={isCreating} />
          </div>

          <div className="list-section">
            {isLoading ? (
              <div className="loading">Loading users...</div>
            ) : (
              <UserList
                users={users}
                onDeleteUser={handleDeleteUser}
                isDeleting={deletingId}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
