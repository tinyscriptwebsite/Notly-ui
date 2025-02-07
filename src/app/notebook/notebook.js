import { useEffect, useState } from "react";
import { fetchNotebooks } from "../utils/api";

const Notebooks = () => {
  const [notebooks, setNotebooks] = useState([]);

  useEffect(() => {
    fetchNotebooks()
      .then((res) => setNotebooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">My Notebooks</h1>
      {notebooks.map((notebook) => (
        <div key={notebook._id} className="p-4 bg-white shadow my-2">
          <h2 className="text-xl">{notebook.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default Notebooks;
