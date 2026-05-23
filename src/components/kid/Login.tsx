import { useState } from "react";

// type LoginProps = {
//   onBack: () => void;
// };

export default function Login() {
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    const user = localStorage.getItem("kid-user");

    if (!user) {
      alert("No user found");
      return;
    }

    const parsedUser = JSON.parse(user);

    if (parsedUser.pin === pin) {
      alert(`Welcome ${parsedUser.name} 🎉`);
    } else {
      alert("Wrong PIN");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: 320,
          background: "#fffbe6",
          padding: 25,
          borderRadius: 16,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2>🐒 Kids Login</h2>

        <input
          type="password"
          placeholder="Enter 4 Digit PIN"
          maxLength={4}
          value={pin}
          onChange={(e) =>
            setPin(e.target.value.replace(/\D/g, ""))
          }
          style={{
            width: "100%",
            padding: 12,
            marginTop: 15,
            borderRadius: 10,
            border: "1px solid #ccc",
            fontSize: 20,
            textAlign: "center",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: 20,
            padding: 12,
            border: "none",
            borderRadius: 10,
            background: "#4caf50",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <button
          // onClick={onBack}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 12,
            border: "none",
            borderRadius: 10,
            background: "#9e9e9e",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Back to Register
        </button>
      </div>
    </div>
  );
}