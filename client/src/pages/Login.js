import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      // ✅ Save token + username
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      // ✅ Redirect properly (React way)
      navigate("/dashboard");

    } catch (err) {
      console.log(err.response?.data);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow rounded-2xl w-80">
        <h2 className="text-xl mb-4 font-bold text-center">Login</h2>

        <input
          className="border p-2 mb-3 w-full rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="border p-2 mb-4 w-full rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 w-full rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}