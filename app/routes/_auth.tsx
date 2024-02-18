import { Outlet } from "@remix-run/react";

function AuthLayout() {
  return (
    <>
      <header></header>
      <main className="flex justify-between">
        <div className="w-1/2"></div>
        <div className="w-1/2">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default AuthLayout;
