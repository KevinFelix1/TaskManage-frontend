import { SessionStorage, redirect, json } from "@remix-run/node";
import bcrypt from "bcrypt";
import { sessionStorage } from "./session.server";
import { Profile, AuthRedirectOptions, User } from "~/lib/auth.types";
import db from "~/database/db.server";
import { createUser } from "~/database/hooks/auth.server";
import jwt from "jsonwebtoken";

// Schemas
import { registerSchema, authenticateSchema } from "~/schemas/auth.schema";

type Response = null | Profile;

interface ValidationErrors {
  [key: string]: string;
  [index: number]: string;
}

class AuthStrategy {
  private session: SessionStorage;

  constructor(session: SessionStorage) {
    this.session = session;
  }

  async authenticate(request: Request, options: AuthRedirectOptions) {
    if (
      typeof options.failureRedirect !== "string" ||
      typeof options.successRedirect !== "string"
    )
      throw new Response("Not exist redirection", { status: 404 });
    const session = await this.session.getSession(
      request.headers.get("Cookie")
    );
    const form = await request.formData();
    const values = {
      email: form.get("email") as string,
      password: form.get("password" as string),
    } as User;

    try {
      authenticateSchema.parse(values);
      const user = await db.user.findUnique({
        where: {
          email: values.email,
        },
      });

      if (user === null) {
        session.flash("error", "Usuario no encontrado");
        // Redirect back to the login page with errors.
        throw redirect(options.failureRedirect, {
          headers: {
            "Set-Cookie": await this.session.commitSession(session),
          },
        });
      }
      const match = await bcrypt.compare(values.password, user.password);
      if (!match) {
        session.flash("error", "Email u contraseña no es valida");
        // Redirect back to the login page with errors.
        throw redirect(options.failureRedirect, {
          headers: {
            "Set-Cookie": await this.session.commitSession(session),
          },
        });
      }
      if (user.verified === false) {
        session.flash("error", "Usuario no verificado");
        // Redirect back to the login page with errors.
        throw redirect(options.failureRedirect, {
          headers: {
            "Set-Cookie": await this.session.commitSession(session),
          },
        });
      }
      const { username, id, email } = user;
      const token = jwt.sign(
        { id, username, email },
        process.env.SECRET_KEY as string,
        { expiresIn: "1h" }
      );
      session.set("session", token);
    } catch (error: any) {
      if (error.issues) {
        const { issues } = error as any;
        let alerts = {} as ValidationErrors;
        issues.forEach((field: any) => {
          alerts[field.path[0]] = field.message;
        });
        return json(alerts);
      } else {
        console.log(error);
      }
    }

    return redirect(options.successRedirect, {
      headers: {
        "Set-Cookie": await this.session.commitSession(session),
      },
    });
  }

  async register(request: Request, options: AuthRedirectOptions) {
    let response;
    if (
      typeof options.successRedirect !== "string" ||
      typeof options.failureRedirect !== "string"
    )
      throw new Response("not exist redirection", { status: 500 });
    const session = await this.session.getSession(
      request.headers.get("Cookie")
    );
    const form = await request.formData();
    const values = {
      username: form.get("username") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      repeatPassword: form.get("repeatPassword") as string,
    };

    try {
      registerSchema.parse(values);
      const passwordHash = await bcrypt.hash(values.password, 10);
      const { username } = values;
      // const token = jwt.sign({ username }, process.env.SECRET_KEY as string, {
      //   expiresIn: "7d",
      // });
      values.password = passwordHash;
      response = await createUser(values);
      session.flash(
        "success",
        "Tu cuenta fue creada con éxito, revisa tu correo para confirmar tu cuenta."
      );
    } catch (error: any) {
      if (error.issues) {
        const { issues } = error as any;
        let alerts = {} as ValidationErrors;
        issues.forEach((field: any) => {
          alerts[field.path[0]] = field.message;
        });
        return json(alerts);
      } else if (error.meta?.target) {
        console.log(error.meta.target);
        if (error.meta.target === "User_email_key") {
          session.flash("error", "Ups! esta cuenta ya existe.");
          throw redirect(options.failureRedirect, {
            headers: {
              "Set-Cookie": await this.session.commitSession(session),
            },
          });
        } else {
          session.flash("error", "Ups! El nombre de usuario ya esta en uso.");
          throw redirect(options.failureRedirect, {
            headers: {
              "Set-Cookie": await this.session.commitSession(session),
            },
          });
        }
      } else {
        console.log(error);
      }
    }
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
