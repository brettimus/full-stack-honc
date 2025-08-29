import type { User } from '../types';

interface UserListProps {
  users: User[];
  onDeleteUser: (id: string) => void;
  isDeleting: string | null;
}

export function UserList({ users, onDeleteUser, isDeleting }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="user-list">
        <h3>Users</h3>
        <p className="empty-state">
          No users found. Create your first user above!
        </p>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h3>Users ({users.length})</h3>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h4>{user.name}</h4>
              <p className="user-email">{user.email}</p>
              <p className="user-date">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDeleteUser(user.id)}
              disabled={isDeleting === user.id}
              className="delete-button"
              aria-label={`Delete user ${user.name}`}
            >
              {isDeleting === user.id ? 'Deleting...' : '🗑️'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
