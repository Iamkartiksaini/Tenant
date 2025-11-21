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

export default function LoginForm() {

  const { user, isAuthLoading, signInHandler } = useUserContext()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
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
      const res = await login(data)
      const token = res.data.token
      signInHandler(token)
    } catch (error) {
      console.error(error.message)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
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
                        placeholder="Enter your password here"/>
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
