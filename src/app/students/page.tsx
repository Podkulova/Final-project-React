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
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {studentsData.map(student => (
          <tr key={student.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.age}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentsTable;
