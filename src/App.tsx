
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

import { userSchema } from "./userSchema";

type User = {
  id: number;
  name: string;
  age: number;
};


function App() {

  const [users, setUsers] = useState<User[]>([]);

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("")
  const [editAge, setEditAge] = useState("")

  const appName: string = "Mini Flip";

  const addUser = async () => {
    const result = userSchema.safeParse({
      name: name,
      age: Number(age)
    })

    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }

    const { data, error } = await supabase
    .from("users")
    .insert([result.data])
    .select();

    if (error) {
      console.error("Error adding user:", error.message);
      alert("Failed to add user");
      return;
    }

    setUsers((prevUsers) => [...prevUsers, ...data]);

    setName("");
    setAge("");
  }



  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
      .from("users")
      .select("*");

      if (error) {
        console.error("Error fetching users:", error.message);
        return;
      }

      setUsers(data as User[]);
    };

    fetchUsers();
  }, []);

  const startEditing = (user: User) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditAge(String(user.age));
  };

  const updateUser = async () => {
    if (editingId === null) return;

    const result = userSchema.safeParse({
      name: editName,
      age: Number(editAge)
    });

    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }

    const { data, error } = await supabase
    .from("users")
    .update(result.data)
      .eq("id", editingId)
      .select();

    if (error) {
      console.error("Error updating user:", error.message);
      return;
    }

    if (!data || data.length !== 1) {
      alert("User was not updated");
      return;
    }

    const updatedUser = data[0] as User;

    setUsers((prevUsers) => prevUsers.map((user) => user.id === editingId ? updatedUser : user));

    setEditingId(null);
    setEditName("");
    setEditAge("");
  }

  const deleteUser = async (id: number) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    const { data, error } = await supabase 
      .from("users")
      .delete()
      .eq("id", id)
      .select("id");

      if (error) {
        console.error("Error deleting user:", error.message);
        alert("Failed to delete user");
        return;
      }

      if (!data || data.length !== 1) {
        alert("user was not deleted");
        return;
      }

      setUsers((prevUser) => prevUser.filter((user) => user.id !== id));

  };

  return (
    <div>
      <h1>{appName}</h1>

      <h2>Registered Users</h2>

      <ul>
        {
          users.map((user) => (
            <li key={user.id}>
              {
                editingId === user.id ? (
                  <>

                    <input 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="name"
                    />

                    <input 
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    placeholder="age"
                    />

                    <button type="button" onClick={updateUser} >
                      Save
                    </button>

                    <button type="button" onClick={() => setEditingId(null)} >
                      cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteUser(user.id)} 
                    >
                      Delete
                    </button>
                  </>

                ) : (
                  <>
                    {user.name} and {user.age} years old

                    <button type="button" onClick={() => startEditing(user)}>Edit</button>
                  </>
                )
              }
            </li>
          ))
        }
      </ul>

      <h2>Add New User</h2>
      <input 
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input 
        type="number"
        placeholder="Enter age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <button onClick={addUser}>
        add user
      </button>

    </div>
       
  )
}

export default App;

