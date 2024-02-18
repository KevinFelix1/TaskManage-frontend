import { Outlet } from "@remix-run/react";

function AuthLayout() {
  return (
    <>
      <header className="absolute"></header>
      <main className="flex justify-between h-screen">
        <div className="w-1/2 h-full"></div>
        <div className="w-1/2 flex justify-center items-center h-full">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default AuthLayout;
