import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const EditableTable = () => {
  const initialData = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
  ];

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      row.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const handleEditClick = (row) => {
    setEditingId(row.id);
    setEditedRow({ ...row });
  };

  const handleSave = () => {
    setData((prev) =>
      prev.map((item) => (item.id === editingId ? editedRow : item))
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedRow({});
  };

  const handleChange = (e) => {
    setEditedRow({ ...editedRow, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
      <input
        type="text"
        placeholder="Search by name..."
        className="w-full p-2 mb-4 border rounded-lg shadow-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                {editingId === row.id ? (
                  <input
                    name="name"
                    value={editedRow.name}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  row.name
                )}
              </td>
              <td className="p-3">
                {editingId === row.id ? (
                  <input
                    name="email"
                    value={editedRow.email}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  row.email
                )}
              </td>
              <td className="p-3 space-x-2">
                {editingId === row.id ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditClick(row)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-400">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
   </motion.div>
  );
};

export default EditableTable;
