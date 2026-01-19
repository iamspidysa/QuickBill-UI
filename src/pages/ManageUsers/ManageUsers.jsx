import { useEffect, useState } from "react";
import UsersList from "../../components/UserList/UsersList";
import UsersForm from "../../components/UsersForm/UsersForm";
import "./ManageUsers.css";
import toast from "react-hot-toast";
import { fetchUsers } from "../../Service/UserService";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (error) {
        toast.error("Unable to fetch users");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <div className="users-container text-light">
      <div className="left-column">
        <UsersForm setUsers={setUsers} />
      </div>
      <div className="right-column">
        <UsersList users={users} setUsers={setUsers} />
      </div>
    </div>
  );
};

export default ManageUsers;
