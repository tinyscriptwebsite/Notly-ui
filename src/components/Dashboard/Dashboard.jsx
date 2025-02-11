import React from "react";
import Link from "next/link";

const Dashboard = ({ notebooks }) => {
  return (
    <>
      {notebooks && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-5">
            {notebooks.map((notebook) => (
              <NotebookCard key={notebook._id} notebook={notebook} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const NotebookCard = ({ notebook }) => {
  return (
    <Link
      href={`/dashboard/edit/${notebook.type}/${notebook._id}`}
      className="relative aspect-video rounded-xl flex justify-center cursor-pointer select-none items-center border shadow-md hover:shadow-lg transition"
    >
      <h1 className="text-sm">{notebook.title || notebook.type}</h1>
      <div className="absolute inset-0" />
    </Link>
  );
};

export default Dashboard;
