import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>Code Vimarsh Official</h1>
      <p>Total USer: {users.length}</p>
    </div>
  );
}

export default App;
