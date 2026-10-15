
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

type User = {
  id: number;
  name: string;
  age: number;
};


function App() {

  const [users, setUsers] = useState<User[]>([]);

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");

  const appName: string = "Mini Flip";

  const addUser = async () => {
    const trimmedName = name.trim();
    const userAge = Number(age);

    if(
      !trimmedName ||
      !age.trim() ||
      !Number.isInteger(userAge) ||
      userAge <= 0
    ) {
      alert("please enter a valid name and age");
      return;
    }

    const { data, error } = await supabase
    .from("users")
    .insert([
    {
      name: trimmedName,
      age: userAge
    }
  ]).select();

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

  return (
    <div>
      <h1>{appName}</h1>

      <h2>Registered Users</h2>

      <ul>
        {users.map((user) => (
          <li key={user.id}> 
            {`Name: ${user.name}, age: ${user.age}`}
          </li>
        ))}
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

