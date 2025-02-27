import React from 'react'

type Props = {}

const Login = (props: Props) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold text-center mb-4">Sign In</h2>
        <form className="space-y-4">
          <input
            type="username"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Username"
          />
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Password"
          />
          <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login