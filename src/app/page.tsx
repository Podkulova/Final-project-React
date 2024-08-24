"use client"; // Označení komponenty jako Client Component

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter pro navigaci
import 'bootstrap/dist/css/bootstrap.min.css';
import '../resources/styles/globals.css';

export default function App() {
    const router = useRouter(); // Inicializace routeru pro navigaci
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; // Získání tokenu z localStorage

    const handleLogout = () => {
        localStorage.removeItem('token'); // Odstranění JWT tokenu z localStorage
        router.push('/login'); // Přesměrování na přihlašovací stránku
    };

    const handleImageClick = (path: string) => {
        if (!token) {
            alert("Pro zobrazení je třeba se přihlásit."); // Zobrazení hlášky, pokud není uživatel přihlášený
        } else {
            router.push(path); // Přesměrování na příslušnou stránku, pokud je uživatel přihlášený
        }
    };

    return (
        <div>
            {/* Navigační lišta */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link href="/" className="navbar-brand">Školní evidence</Link>
                <div className="ms-auto d-flex">
                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="btn btn-danger ms-2" // Použití Bootstrap tříd pro stylování
                        >
                            Odhlásit
                        </button>
                    ) : (
                        <Link href="/login" className="btn btn-primary ms-2">Přihlásit</Link>
                    )}
                </div>
            </nav>

            {/* Základní obsah pro testování */}
            <div className="text-center content-margin">
                <p>Školní evidence umožňuje evidovat třídy, studenty, učitele a rodiče.</p>
            </div>

            {/* Mřížka obrázků */}
            <div className="image-grid">
                <div className="image-container">
                    <div
                        onClick={() => handleImageClick('/classRooms')}
                        className={`image-link ${!token ? 'disabled-link' : ''}`} // Přidání třídy disabled-link, pokud není přihlášený uživatel
                    >
                        <Image src="/images/clasroom.png" alt="Classroom Image" width={500} height={300} />
                        <p>Evidence tříd, jejich třídních učitelů a studentů.</p>
                    </div>
                </div>
                <div className="image-container">
                    <div
                        onClick={() => handleImageClick('/teachers')}
                        className={`image-link ${!token ? 'disabled-link' : ''}`}
                    >
                        <Image src="/images/teacher.png" alt="Teacher Image" width={500} height={300} />
                        <p>Evidence třídních učitelů</p>
                    </div>
                </div>
                <div className="image-container">
                    <div
                        onClick={() => handleImageClick('/students')}
                        className={`image-link ${!token ? 'disabled-link' : ''}`}
                    >
                        <Image src="/images/student.png" alt="Student Image" width={500} height={300} />
                        <p>Evidence studentů</p>
                    </div>
                </div>
                <div className="image-container">
                    <div
                        onClick={() => handleImageClick('/parents')}
                        className={`image-link ${!token ? 'disabled-link' : ''}`}
                    >
                        <Image src="/images/parent.png" alt="Parent Image" width={500} height={300} />
                        <p>Evidence rodičů</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
