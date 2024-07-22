// src/components/StudentsTable.tsx

import React from 'react';

interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
}

const studentsData: Student[] = [
  { id: 1, name: 'Alice Johnson', age: 20, grade: 'A' },
  { id: 2, name: 'Bob Smith', age: 22, grade: 'B' },
  { id: 3, name: 'Charlie Brown', age: 21, grade: 'A' },
  { id: 4, name: 'Daisy Lee', age: 23, grade: 'C' },
];

const StudentsTable: React.FC = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {studentsData.map(student => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>{student.name}</td>
            <td>{student.age}</td>
            <td>{student.grade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentsTable;
