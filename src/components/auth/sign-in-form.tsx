"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/use-cases/use-auth";
import { SiGoogle } from "@icons-pack/react-simple-icons";

export function SignIn() {
  const { signIn, isAuthenticated, user, subscription, signOut } = useAuth();
  // const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

  if (isAuthenticated) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl tracking-tight">
          Você está logado!
        </h2>
        <ul>
          <li>Nome: {user?.name}</li>
          <li>Email: {user?.email}</li>
          <li>Assina a newsletter: {subscription ? "Sim" : "Não"}</li>
          {subscription && (
            <li>
              Assinatura paga: {subscription?.paidSubscription ? "Sim" : "Não"}
            </li>
          )}
        </ul>
        <Button onClick={signOut}>Sair</Button>
      </div>
    );
  }

  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      size="xl"
      onClick={() => void signIn("google")}
    >
      <SiGoogle className="mr-2 h-4 w-4" /> Entrar com o Google
    </Button>
  );

  // return (
  //   <div className="min-w-[384px] flex flex-col gap-4">
  //     {step === "signIn" ? (
  //       <>
  //         <Button
  //           className="flex-1"
  //           variant="outline"
  //           type="button"
  //           onClick={() => void signIn("google")}
  //         >
  //           <SiGoogle className="mr-2 h-4 w-4" /> Entrar com o Google
  //         </Button>
  //         {/* <SignInWithMagicLink handleLinkSent={() => setStep("linkSent")} /> */}
  //       </>
  //     ) : (
  //       <>
  //         <h2 className="font-semibold text-2xl tracking-tight">
  //           Verifique seu e-mail
  //         </h2>
  //         <p>Um link de acesso foi enviado para o seu e-mail.</p>
  //         <Button
  //           className="p-0 self-start"
  //           variant="link"
  //           onClick={() => setStep("signIn")}
  //         >
  //           Cancel
  //         </Button>
  //       </>
  //     )}
  //     <Toaster />
  //   </div>
  // );
}

// function SignInWithMagicLink({
//   handleLinkSent,
// }: {
//   handleLinkSent: () => void;
// }) {
//   const { signIn } = useAuth();
//   const { toast } = useToast();
//   const [submitting, setSubmitting] = useState(false);
//   return (
//     <form
//       className="flex flex-col"
//       onSubmit={(event) => {
//         event.preventDefault();
//         setSubmitting(true);
//         const formData = new FormData(event.currentTarget);
//         signIn("resend", formData)
//           .then(handleLinkSent)
//           .catch((error) => {
//             console.error(error);
//             toast({
//               title: "Could not send sign-in link",
//               variant: "destructive",
//             });
//             setSubmitting(false);
//           });
//       }}
//     >
//       <Label htmlFor="email">Email</Label>
//       <Input
//         name="email"
//         id="email"
//         className="mb-4 mt-2"
//         autoComplete="email"
//         inputMode="email"
//       />
//       <Button type="submit" disabled={submitting}>
//         Enviar link por e-mail
//       </Button>
//     </form>
//   );
// }
