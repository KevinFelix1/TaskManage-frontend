import {
  ActionFunctionArgs,
  MetaFunction,
  LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { useLoaderData, useActionData, Form, Link } from "@remix-run/react";
import Authenticator from "~/services/auth.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ValidationErrors } from "~/lib/auth.types";
import { getSession, commitSession } from "~/services/session.server";

type DataResponse = {
  error: string;
};

export const meta: MetaFunction = () => {
  return [
    { title: "TaskManager | Register" },
    { name: "description", content: "Welcome to register page!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const data = { error: session.get("error") };
  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return await Authenticator.register(request, {
    failureRedirect: "/register",
    successRedirect: "/login",
  });
};

function RegisterPage() {
  const actionData = useActionData() as ValidationErrors;
  const loaderData = useLoaderData() as DataResponse;
  // console.log(loaderData);
  return (
    <>
      <h1 className="text-3xl font-semibold cursor-default">Crear cuenta</h1>
      <p className="font-light text-lg my-2 text-center">
        Genial! nos da gusto que pienses en nosotros como nosotros en ti. <br />
        No te preocupes estas en el lugar correcto.
      </p>
      {loaderData?.error && (
        <p className="mt-2 text-center font-light text-red-600 px-3 py-1 bg-red-200 rounded-sm">
          {loaderData?.error}
        </p>
      )}
      <Form className="w-96 mt-4 space-y-4" method="POST">
        <div className="space-y-1 relative">
          {actionData?.username && (
            <p className="text-red-600 bg-red-200 px-2 rounded-sm absolute bottom-[74px]">
              {actionData.username}
            </p>
          )}
          <Label
            htmlFor="username"
            className="block text-md relative after:absolute after:content-['*'] after:text-2xl after:-bottom-1 after:ml-1 after:text-red-700">
            Username
          </Label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="Como quieres que te llamemos?."
            className="h-12 border-zinc-700"
          />
        </div>
        <div className="space-y-1 relative">
          {actionData?.email && (
            <p className="text-red-600 bg-red-200 px-2 rounded-sm absolute left-16 bottom-14">
              {actionData.email}
            </p>
          )}
          <Label
            htmlFor="email"
            className="block text-md relative after:absolute after:content-['*'] after:text-2xl after:-bottom-1 after:ml-1 after:text-red-700">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Ingresa tu dirección de correo electrónico."
            className="h-12 border-zinc-700"
          />
        </div>
        <div className="space-y-1 relative">
          {actionData?.password && (
            <p className="text-red-600 bg-red-200 px-2 rounded-sm absolute left-24 bottom-14">
              {actionData.password}
            </p>
          )}
          {actionData?.undefined && (
            <p className="text-red-600 bg-red-200 px-2 rounded-sm absolute left-24 bottom-14">
              {actionData.undefined}
            </p>
          )}
          <Label
            htmlFor="password"
            className="block text-md relative after:absolute after:content-['*'] after:text-2xl after:-bottom-1 after:ml-1 after:text-red-700">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Ingresa tu password."
            className="h-12 border-zinc-700"
          />
        </div>
        <div className="space-y-1 relative">
          {actionData?.repeatPassword && (
            <p className="text-red-600 bg-red-200 px-2 rounded-sm absolute left-36 bottom-14">
              {actionData.repeatPassword}
            </p>
          )}
          <Label
            htmlFor="repeatPassword"
            className="block text-md relative after:absolute after:content-['*'] after:text-2xl after:-bottom-1 after:ml-1 after:text-red-700">
            Repeat password
          </Label>
          <Input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            placeholder="Repite tu password."
            className="h-12 border-zinc-700"
          />
        </div>
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
