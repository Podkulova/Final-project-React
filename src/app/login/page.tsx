// pages/students.tsx

import React from "react";
import Login from "@/components/Login";
const LoginPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Student Directory</h1>
        <Login/>
      </div>
    </main>
  );
};

export default LoginPage;
