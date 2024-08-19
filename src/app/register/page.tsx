
import React from "react";
import Register from "@/components/Register";
const RegisterPage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8">
            <div className="max-w-5xl w-full">
                <h1 className="text-3xl font-bold mb-4 text-center"></h1>
                <Register/>
            </div>
        </main>
    );
};

export default RegisterPage;