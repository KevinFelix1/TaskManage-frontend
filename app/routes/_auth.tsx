import { Outlet } from "@remix-run/react";

function AuthLayout() {
  return (
    <>
      <header className="absolute"></header>
      <main className="flex justify-between h-screen">
        <div className="w-1/2 h-full bg-auth_banner bg-cover bg-center bg-no-repeat"></div>
        <div className="w-1/2 flex flex-col justify-center items-center h-full bg-neutral-200 text-zinc-950">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default AuthLayout;
