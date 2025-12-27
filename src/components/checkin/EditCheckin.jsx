import React, {useState} from 'react'


const EditCheck = () => {
    const [data, setData] = useState([
        { id: 1, name: "John Doe", age: 28 },
        { id: 2, name: "Jane Smith", age: 34 },
        { id: 3, name: "Alice Johnson", age: 25 },
      ]);
    
      const [editId, setEditId] = useState(null);
      const [editValue, setEditValue] = useState("");
    
      const handleEdit = (id, currentName) => {
        setEditId(id);
        setEditValue(currentName);
      };
    
      const handleSave = (id) => {
        setData(data.map(item => 
          item.id === id ? { ...item, name: editValue } : item
        ));
        setEditId(null);
      };
    
      return (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>
                  {editId === row.id ? (
                    <input 
                      type="text" 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)} 
                    />
                  ) : (
                    row.name
                  )}
                </td>
                <td>{row.age}</td>
                <td>
                  {editId === row.id ? (
                    <button onClick={() => handleSave(row.id)}>Save</button>
                  ) : (
                    <button onClick={() => handleEdit(row.id, row.name)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

export default EditCheck