import { Link, Outlet } from "@remix-run/react";
import ToggleTheme from "~/components/locals/toggle.theme";

const Header = () => {
  return (
    <header className="absolute w-full h-20 px-10 flex justify-between items-center">
      <section>
        <Link
          to={"/login"}
          className="text-4xl text-white font-black flex items-center gap-2 px-3 py-2 bg-neutral-950/10 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-9 h-9">
            <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
          </svg>
          TaskManager
        </Link>
      </section>
      <div className="flex items-center justify-end pr-5 dark:text-white">
        <ToggleTheme />
      </div>
    </header>
  );
};

function AuthLayout() {
  return (
    <>
      <Header />
      <main className="flex justify-between h-screen">
        <div className="w-1/2 h-full bg-auth_banner bg-cover bg-center bg-no-repeat"></div>
        <div className="w-1/2 flex flex-col justify-center items-center h-full bg-neutral-50 text-zinc-950 dark:bg-zinc-950 dark:text-neutral-100">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default AuthLayout;
