import React from 'react'
import { useAuth } from '../../context/auth';

function Teacher() {
    const { logout } = useAuth();
    return (
        <>
              <div className="flex justify-between items-center m-8">
                <h2 className="text-blue-600 text-4xl font-bold">Teacher Dashboard</h2>

                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-all cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </>
    )
}

export default Teacher
