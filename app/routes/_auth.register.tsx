import { MetaFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { registerFields } from "~/utils/auth.utils";
export const meta: MetaFunction = () => {
  return [
    { title: "TaskManager | Register" },
    { name: "description", content: "Welcome to register page!" },
  ];
};

export const action = async () => {
  const response = await fetch(process.env.URL as string, {
    method: "GET",
  });
  console.log(response);
  return null;
};

function RegisterPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold cursor-default">Crear cuenta</h1>
      <p className="font-light text-lg my-2 text-center">
        Genial! nos da gusto que pienses en nosotros como nosotros en ti. <br />
        No te preocupes estas en el lugar correcto.
      </p>
      <Form className="w-96 mt-4 space-y-4" method="POST">
        {registerFields.map((field) => (
          <>
            <Label
              htmlFor={field.name}
              className="block text-md relative after:absolute after:content-['*'] after:text-2xl after:-bottom-1 after:ml-1 after:text-red-700">
              {field.label}
            </Label>
            <Input
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.message}
              className="h-12 border-zinc-700"
            />
          </>
        ))}
        <div className="flex justify-end">
          <Button className="w-28 h-12">Crear cuenta</Button>
        </div>
        <div className="flex gap-2 mx-auto w-fit">
          <p>Ya tienes una cuenta?</p>
          <Link to={"/login"} className="text-blue-600 hover:underline">
            Iniciar session
          </Link>
        </div>
      </Form>
    </>
  );
}

export default RegisterPage;
