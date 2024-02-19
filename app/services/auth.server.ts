import { SessionStorage, redirect, json } from "@remix-run/node";
import { sessionStorage } from "./session.server";
import { User, AuthRedirectOptions } from "../lib/auth.types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "~/database/db.server";
// Schemas
import { registerSchema } from "~/schemas/auth.schema";

type Response = null | User;

interface ValidationErrors {
  [key: string]: string;
  [index: number]: string;
}

class AuthStrategy {
  private session: SessionStorage;

  constructor(session: SessionStorage) {
    this.session = session;
  }

  // async authenticate(request: Request, options: AuthRedirectOptions) {
  //   let errors: Errors = {};
  //   if (typeof options.failureRedirect !== "string")
  //     throw new Response("No existe redireccion", { status: 404 });
  //   if (typeof options.successRedirect !== "string")
  //     throw new Response("No existe redireccion", { status: 404 });
  //   const session = await this.session.getSession(
  //     request.headers.get("Cookie")
  //   );
  //   const form = await request.formData();
  //   const email = form.get("email") as string;
  //   const password = form.get("password") as string;
  //   //validations on client
  //   if (!this.verifyEmail(email)) errors.email = "Email invalido";
  //   if (password.length < 8) errors.password = "Contraseña no valida";
  //   if (Object.keys(errors).length > 0) return json({ errors });
  //   //search in the database of user
  //   const user = await db.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   if (user === null) {
  //     session.flash("error", "Usuario no encontrado");
  //     // Redirect back to the login page with errors.
  //     throw redirect(options.failureRedirect, {
  //       headers: {
  //         "Set-Cookie": await this.session.commitSession(session),
  //       },
  //     });
  //   }
  //   const match = await bcrypt.compare(password, user.password);
  //   if (!match) {
  //     session.flash("error", "Email u contraseña no es valida");
  //     // Redirect back to the login page with errors.
  //     throw redirect(options.failureRedirect, {
  //       headers: {
  //         "Set-Cookie": await this.session.commitSession(session),
  //       },
  //     });
  //   }
  //   if (user.verified === false) {
  //     session.flash("error", "Usuario no verificado");
  //     // Redirect back to the login page with errors.
  //     throw redirect(options.failureRedirect, {
  //       headers: {
  //         "Set-Cookie": await this.session.commitSession(session),
  //       },
  //     });
  //   }
  //   //set token in the session
  //   const { name, lastname, id } = user;
  //   const token = `Bearer ${jwt.sign(
  //     { id, email, name, lastname },
  //     process.env.SECRET_KEY as string,
  //     { expiresIn: "1h" }
  //   )}`;
  //   session.set("authToken", token);
  //   return redirect(options.successRedirect, {
  //     headers: {
  //       "Set-Cookie": await this.session.commitSession(session),
  //     },
  //   });
  // }

  async register(request: Request, options: AuthRedirectOptions) {
    let response;
    if (typeof options.successRedirect !== "string")
      throw new Response("no existe redireccion", { status: 404 });
    if (typeof options.failureRedirect !== "string")
      throw new Response("No existe redireccion", { status: 404 });
    const session = await this.session.getSession(
      request.headers.get("Cookie")
    );
    const form = await request.formData();
    const username = String(form.get("username"));
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const repeatPassword = String(form.get("repeatPassword"));

    const values = {
      username,
      email,
      password,
      repeatPassword,
    };

    try {
      registerSchema.parse(values);
    } catch (error) {
      const { issues } = error as any;
      let alerts = {} as ValidationErrors;
      issues.forEach((field: any) => {
        alerts[field.path[0]] = field.message;
      });
      return json(alerts);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.SECRET_KEY as string, {
      expiresIn: "7d",
    });
    try {
      response = await db.user.create({
        data: {
          username,
          email,
          password: passwordHash,
        },
      });
    } catch (error) {
      session.flash("error", "Ups! esta cuenta ya existe");
      throw redirect(options.failureRedirect, {
        headers: {
          "Set-Cookie": await this.session.commitSession(session),
        },
      });
    }
    session.flash(
      "success",
      "Tu cuenta fue creada con éxito 🥳, revisa tu correo para confirmar tu cuenta."
    );
    return redirect(options.successRedirect, {
      headers: {
        "Set-Cookie": await this.session.commitSession(session),
      },
    });
  }

  // async isAuthenticated(request: Request, options: AuthRedirectOptions) {
  //   if (typeof options.failureRedirect !== "string")
  //     throw new Response("No existe redireccion", { status: 404 });
  //   let user;
  //   let session = await this.session.getSession(request.headers.get("Cookie"));
  //   try {
  //     const sessionValue: string = session.data?.authToken || "";
  //     const token = sessionValue.replace("Bearer ", "");
  //     user = jwt.verify(token, process.env.SECRET_KEY as string) as User;
  //     if (!user.id) {
  //       session.flash("error", "User not auth");
  //       throw redirect(options.failureRedirect, {
  //         headers: {
  //           "Set-Cookie": await this.session.commitSession(session),
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     session.flash("error", "User not auth");
  //     throw redirect(options.failureRedirect, {
  //       headers: {
  //         "Set-Cookie": await this.session.commitSession(session),
  //       },
  //     });
  //   }
  //   return user;
  // }

  // async logout(request: Request) {
  //   const session = await this.session.getSession(
  //     request.headers.get("Cookie")
  //   );
  //   return redirect("/", {
  //     headers: {
  //       "Set-Cookie": await this.session.destroySession(session),
  //     },
  //   });
  // }

  // async verifyToken(token: string) {
  //   try {
  //     const userToken = jwt.verify(
  //       token,
  //       process.env.SECRET_KEY as string
  //     ) as User;
  //     const user = await db.user.update({
  //       where: {
  //         email: userToken.email,
  //       },
  //       data: {
  //         verified: true,
  //       },
  //     });
  //     const response = {
  //       name: user.name,
  //       lastname: user.lastname,
  //     };
  //     return response;
  //   } catch (error: any) {
  //     throw redirect("/auth/login");
  //   }
  // }

  // verifyEmail(email: string): boolean {
  //   const regexEmail = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  //   const resultEmail = regexEmail.test(email);
  //   return resultEmail;
  // }
}

const Authenticator = new AuthStrategy(sessionStorage);
export default Authenticator;
