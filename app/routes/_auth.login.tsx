import {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
  json,
} from "@remix-run/node";
import {
  useLoaderData,
  useActionData,
  Form,
  Link,
  useNavigation,
} from "@remix-run/react";
import Authenticator from "~/services/auth.server";
import { getSession, commitSession } from "~/services/session.server";
import { ValidationErrors } from "~/lib/auth.types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Spinner from "~/components/locals/spinner";

type DataResponse = {
  error: string;
  success: string;
};

export const meta: MetaFunction = () => {
  return [
    { title: "TaskManager | login" },
    { name: "description", content: "Welcome to login page!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const data = { success: session.get("success"), error: session.get("error") };
  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return await Authenticator.authenticate(request, {
    failureRedirect: "/login",
    successRedirect: "/dashboard",
  });
};

function Login() {
  const navigation = useNavigation();
  const actionData = useActionData() as ValidationErrors;
  console.log(actionData);
  const loaderData = useLoaderData() as DataResponse;
  return (
    <>
      <h1 className="text-3xl font-semibold cursor-default">Iniciar session</h1>
      <p className="font-light text-lg my-2">
        Si deseas organizar tus trabajos estas en el lugar correcto.
      </p>
      {loaderData?.error && (
        <p className="mt-2 text-center font-light text-red-600 px-3 py-1 bg-red-200 rounded-sm">
          {loaderData?.error}
        </p>
      )}
      {loaderData?.success && (
        <p className="mt-2 text-center font-light text-blue-600 px-3 py-1 bg-blue-200 rounded-sm">
          {loaderData?.success}
        </p>
      )}
      <Form className="w-96 mt-4 space-y-4" method="POST">
        <div className="space-y-1">
          {actionData?.email && (
            <p className="text-red-600 bg-red-200 px-2 py-1 rounded-sm">
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
            placeholder="Ingresa tu correo electrónico."
            className="h-12 border-zinc-700"
          />
        </div>
        <div className="space-y-1">
          {actionData?.password && (
            <p className="text-red-600 bg-red-200 px-2 py-1 rounded-sm">
              {actionData.password}
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
            placeholder="Ingresa tu contraseña."
            className="h-12 border-zinc-700"
          />
        </div>
        {navigation.state === "submitting" ? (
          <div className="flex justify-center w-full">
            <Spinner />
          </div>
        ) : (
          <div className="flex justify-end">
            <Button className="w-20 h-12">GO!</Button>
          </div>
        )}

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
