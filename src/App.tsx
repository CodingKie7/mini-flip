
import { useState } from "react";

type User = {
  id: number;
  name: string;
  age: number;
};


function App() {

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Kie", age: 29},
    { id: 2, name: "Billy", age: 27}
  ])

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");

  const appName: string = "Mini Flip";

  function addUser() {
    const newUser: User = {
      id: Math.max(0, ...users.map( user => user.id)) + 1,
      name: name.trim(),
      age: Number(age)
    };

    if (!newUser.name || !age.trim() || !Number.isInteger(newUser.age) || newUser.age <= 0) {
      alert("Please enter a valid name or age");
      return;
    }

    setUsers([...users, newUser])
    setName("");
    setAge("");
  }

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
