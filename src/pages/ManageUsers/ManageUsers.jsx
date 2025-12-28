import UsersList from '../../components/UserList/UsersList';
import UsersForm from '../../components/UsersForm/UsersForm';
import './ManageUsers.css';

const ManageUsers = () => {
  return (
    <div className="users-container text-light">
      <div className="left-column">
        <UsersForm/>
      </div>
      <div className="right-column">
        <UsersList/>
      </div>
    </div>
  )
}

export default ManageUsers;