import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { cn } from "@/lib/utils";
import { RegisterSchema } from "@/lib/validations";
import { useUserContext } from "@/store/UserContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ReactHookField } from "./ui/form-label";
import { register } from "@/api/service";
import { toast } from "react-toastify";
export default function SignupForm({
  ...props
}) {


  const { user, isAuthLoading, signInHandler } = useUserContext()
  const [isLoading, setIsLoading] = useState(false)
  const { handleSubmit, setValue, setError, control, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirm_password: ""
    },
    resolver: yupResolver(RegisterSchema),
    reValidateMode: "onChange"
  })


  async function submit(data) {

    if (data.password !== data.confirm_password) {
      setError("confirm_password", { message: "Confirm Password is not matching with password" })
      return
    }
    else {
      setError("confirm_password", false)
    }

    if (isAuthLoading) return
    setIsLoading(true)
    try {
      const { email, password, name } = data
      const { success, data: responseData, message } = await register({ email, password, name })
      if (success) {
        const token = res.data.token
        signInHandler(token)
        toast.success("Welcome, " + responseData?.user?.name)
      }
      else {
        throw new Error(message)
      }
    }
    catch (error) {
      toast.error(error.message)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", "max-w-2xl w-full")}>
      <Card {...props}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)}>
            <FieldGroup>
              <ReactHookField control={control} registerKey={"name"} label="Full Name" errors={errors}
                placeholder="John Doe"
              />

              <ReactHookField control={control} registerKey={"email"} label="Email" errors={errors}
                placeholder="Enter your email address"
              />

              <ReactHookField control={control} fieldType="password" registerKey={"password"} label="Password" errors={errors}
                placeholder="Enter your password here" />

              <ReactHookField control={control} fieldType="password" registerKey={"confirm_password"} label="Confirm Password" errors={errors}
                placeholder="Confirm password" />

              <FieldGroup>
                <Field>
                  <Button disable={(isAuthLoading || isLoading).toString()} type="submit">{isLoading ? "Creating..." : "Create Account"}</Button>
                  <FieldDescription className="px-6 text-center">
                    Already have an account? <Link to="/auth/login">Sign in</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
