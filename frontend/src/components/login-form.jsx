import { cn } from "@/lib/utils"
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
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ReactHookField } from "./ui/form-label"
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema } from "@/lib/validations"
import { login } from "@/api/service"
import { useUserContext } from "@/store/UserContext"
import { useState } from "react"
import { toast } from "react-toastify"

export default function LoginForm() {

  const { isAuthLoading, signInHandler } = useUserContext()
  const [isLoading, setIsLoading] = useState(false)
  const { setError, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: yupResolver(LoginSchema),
    reValidateMode: "onChange"
  })

  async function submit(data) {
    if (isAuthLoading) return
    setIsLoading(true)
    try {
      const { success, data: responseData, message } = await login(data)
      if (success) {
        const token = responseData?.token
        signInHandler(token)
        toast.success("Welcome, " + responseData?.user?.name)
      } else {
        // if (message.toLowerCase()?.includes("pass")) {
        //   setError("password", { type: "onChange", message: message })
        // }
        throw new Error(message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    finally {
      setIsLoading(false)
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription >
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submit)}>
          <FieldGroup>
            <ReactHookField control={control} registerKey={"email"} label="Email" errors={errors}
              placeholder="Enter your email address"
            />
            <ReactHookField control={control} registerKey={"password"} label="Password" errors={errors}
              placeholder="Enter your password here" />
            <Field>
              <Button disable={(isAuthLoading || isLoading).toString()} type="submit">{isLoading ? "Logging..." : "Login"}</Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link to={"/auth/register"}>Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
