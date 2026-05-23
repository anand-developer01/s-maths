import { useState } from "react";

// type RegisterProps = {
//   onRegister: () => void;
// };

// export default function Register({
//   onRegister,
// }: RegisterProps) {
export default function Register() {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");

  const handleRegister = () => {
    if (!name.trim()) {
      alert("Please enter name");
      return;
    }

    if (pin.length !== 4) {
      alert("PIN must be 4 digits");
      return;
    }

    localStorage.setItem(
      "kid-user",
      JSON.stringify({
        name,
        pin,
      })
    );

    alert("Registration Successful 🎉");

    // onRegister();
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
        <h2>🐘 Kids Register</h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 15,
            borderRadius: 10,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Create 4 Digit PIN"
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
          onClick={handleRegister}
          style={{
            width: "100%",
            marginTop: 20,
            padding: 12,
            border: "none",
            borderRadius: 10,
            background: "#ff9800",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}