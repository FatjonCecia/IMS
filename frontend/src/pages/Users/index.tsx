import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
} from "../../provider/queries/Users.query";

type User = {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
};

const UserPage = () => {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [dialogVisible, setDialogVisible] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllUsersQuery(undefined, { skip: !token });

  const [createUser, { isLoading: creating }] =
    useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // ✅ Email validation
  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ✅ Strong password validation
  const isPasswordValid = (password: string) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password);

  // 🔥 Create User
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("All fields are required");
      return;
    }

    if (!isEmailValid(newUser.email)) {
      setEmailError("Invalid email address");
      return;
    }

    if (!isPasswordValid(newUser.password)) {
      setPasswordError(
        "Password must be at least 8 characters, include 1 uppercase letter and 1 number"
      );
      return;
    }

    try {
      await createUser(newUser).unwrap();

      setNewUser({
        name: "",
        email: "",
        password: "",
      });

      setEmailError("");
      setPasswordError("");
      setDialogVisible(false);
      refetch();
    } catch (error: any) {
      console.error("Create user failed:", error);
      alert(error?.data?.message || "Failed to create user");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUser(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete user");
    }
  };

  const dateTemplate = (row: User) => {
    if (!row.createdAt) return "-";
    return new Date(row.createdAt).toLocaleDateString();
  };

  const roleTemplate = () => (
    <Tag value="INTERNAL" severity="info" />
  );

  const actionTemplate = (row: User) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-trash"
        severity="danger"
        size="small"
        onClick={() => handleDelete(row._id)}
      />
    </div>
  );

  if (!token) return <div className="p-6">Please login first.</div>;
  if (isLoading) return <div className="p-6">Loading users...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Failed to load users</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-sm text-gray-500">
            Internal panel users (Operations, Support, Managers)
          </p>
        </div>

        <Button
          label="Add User"
          icon="pi pi-plus"
          severity="success"
          onClick={() => setDialogVisible(true)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          value={users}
          paginator
          rows={10}
          responsiveLayout="scroll"
          emptyMessage="No users found"
          className="text-sm"
        >
          <Column field="name" header="Name" />
          <Column field="email" header="Email" />
          <Column header="Role" body={roleTemplate} />
          <Column header="Created" body={dateTemplate} />
          <Column
            header="Delete User"
            body={actionTemplate}
            style={{ width: "120px" }}
          />
        </DataTable>
      </div>

      <Dialog
        header="Create New User"
        visible={dialogVisible}
        style={{ width: "400px" }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <InputText
              className="w-full"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <InputText
              className={`w-full ${emailError ? "p-invalid" : ""}`}
              value={newUser.email}
              onChange={(e) => {
                const value = e.target.value;
                setNewUser({ ...newUser, email: value });

                if (!isEmailValid(value)) {
                  setEmailError("Invalid email address");
                } else {
                  setEmailError("");
                }
              }}
            />
            {emailError && <small className="p-error">{emailError}</small>}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <InputText
              type="password"
              className={`w-full ${passwordError ? "p-invalid" : ""}`}
              value={newUser.password}
              onChange={(e) => {
                const value = e.target.value;
                setNewUser({ ...newUser, password: value });

                if (!isPasswordValid(value)) {
                  setPasswordError(
                    "Min 8 chars, 1 uppercase, 1 number"
                  );
                } else {
                  setPasswordError("");
                }
              }}
            />
            {passwordError && (
              <small className="p-error">{passwordError}</small>
            )}
          </div>

          <Button
            label="Create User"
            icon="pi pi-check"
            loading={creating}
            onClick={handleCreateUser}
            className="w-full"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default UserPage;