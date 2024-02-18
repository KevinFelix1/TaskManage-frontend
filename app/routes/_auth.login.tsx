import { useLoaderData, useActionData, Form, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

function Login() {
  return (
    <>
      <h1 className="text-3xl font-semibold cursor-default">Iniciar session</h1>
      <p className="font-light text-lg my-2">
        Si deseas organizar tus trabajos estas en el lugar correcto.
      </p>
      <Form className="w-96 mt-4 space-y-4">
        <Label
          htmlFor="email"
          className="block text-md relative after:absolute after:content-['*'] after:text-2xl after:-bottom-1 after:ml-1 after:text-red-700">
          Email
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Ingresa tu correo electrónico."
          className="h-12 border-zinc-700"
        />
        <Label
          htmlFor="password"
          className="block text-md relative after:absolute after:content-['*'] after:text-2xl after:-bottom-1 after:ml-1 after:text-red-700">
          Password
        </Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Ingresa tu contraseña."
          className="h-12 border-zinc-700"
        />
        <div className="flex justify-end">
          <Button className="w-20 h-12">GO!</Button>
        </div>
        <div className="flex gap-2 mx-auto w-fit">
          <p>Aun no tienes cuenta?</p>
          <Link to={"/register"} className="text-blue-600 hover:underline">
            Registrase!
          </Link>
        </div>
      </Form>
    </>
  );
}

export default Login;
