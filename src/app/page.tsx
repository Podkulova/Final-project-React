import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../resources/styles/globals.css';

export default function App() {
    return (
        <div>
            {/* Navigační lišta */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link href="/" className="navbar-brand">Školní evidence</Link>
            </nav>

            {/* Základní obsah pro testování */}
            <div className="text-center content-margin">
                <p>Školní evidence umožňuje evidovat třídy, studenty, učitele a rodiče.</p>
            </div>

            {/* Mřížka obrázků */}
            <div className="image-grid">
                <div className="image-container">
                    <Link href="/classRoom" className="image-link">
                        <Image src="/images/clasroom.png" alt="Classroom Image" width={500} height={300}/>
                        <p>Evidence tříd, jejich třídních učitelů a studentů.</p>
                    </Link>
                </div>
                <div className="image-container">
                    <Link href="/teacher" className="image-link">
                        <Image src="/images/teacher.png" alt="Teacher Image" width={500} height={300}/>
                        <p>Evidence třídních učitelů</p>
                    </Link>
                </div>
                <div className="image-container">
                    <Link href="/StudentsTable" className="image-link">
                        <a className="image-link">
                            <Image src="/images/student.png" alt="Student Image" width={500} height={300}/>
                            <p>Evidence studentů</p>
                        </a>
                    </Link>
                </div>
                <div className="image-container">
                    <Link href="/parent" className="image-link">
                        <Image src="/images/parent.png" alt="Parent Image" width={500} height={300}/>
                        <p>Evidence rodičů</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
