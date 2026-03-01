import { ErrorMessage, Field, Formik } from 'formik'
import { Button } from 'primereact/button'
import { useNavigate, Link } from 'react-router-dom'
import * as yup from 'yup'
import { useLoginUserMutation } from '../provider/queries/Auth.query'

const Login = () => {
  const navigate = useNavigate()
  const [loginUser, loginUserResponse] = useLoginUserMutation()

  type User = {
    email: string
    password: string
  }

  const initialValues: User = {
    email: '',
    password: ''
  }

  const validationSchema = yup.object({
    email: yup.string().email("Email must be valid").required("Email is required"),
    password: yup.string().min(5, "Password must be at least 5 characters").required("Password is required"),
  })

  const onSubmitHandler = async (values: User, { setSubmitting, resetForm }: any) => {
    try {
      setSubmitting(true)

      // 🔥 Get real backend response
      const response = await loginUser(values).unwrap()

      console.log("LOGIN RESPONSE:", response) // keep for debugging

      /**
       * 🔒 Robust token extraction (handles ALL backend formats):
       * - { token: "..." }
       * - { accessToken: "..." }
       * - { data: { token: "..." } }
       * - { data: { accessToken: "..." } }
       */
      const token =
        response?.token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.accessToken ||
        null

      if (!token) {
        console.error("Token not found in response:", response)
        alert("Login failed: Token not received from server")
        return
      }

      // ✅ Store token (CRITICAL for protected inventory routes)
      localStorage.setItem("token", token)

      // Optional but recommended (for user context)
      const user =
        response?.user ||
        response?.data?.user ||
        null

      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      }

      alert("Login successful!")
      resetForm()

      // 🚀 Redirect to protected dashboard (Home = Inventory)
      navigate("/")

    } catch (err: any) {
      console.error("Login error:", err)

      alert(
        err?.data?.message ||
        err?.message ||
        "Invalid email or password"
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-[#eee]'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
        validateOnMount
      >
        {({ handleSubmit, isValid, isSubmitting }) => (
          <form
            onSubmit={handleSubmit}
            className="w-[96%] md:w-[70%] lg:w-1/3 shadow-md rounded-md pt-10 pb-3 px-4 bg-white"
          >
            <div className="mb-3 py-1">
              <label htmlFor="email">Email</label>
              <Field
                id='email'
                name='email'
                className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
                placeholder='Enter Email Address'
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm' name='email' />
            </div>

            <div className="mb-3 py-1">
              <label htmlFor="password">Password</label>
              <Field
                id='password'
                name='password'
                type='password'
                className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
                placeholder='********'
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm' name='password' />
            </div>

            <div className="mb-3 py-1 flex items-center justify-center">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid || loginUserResponse.isLoading}
                className='w-full bg-red-500 text-white py-3 px-2 flex items-center justify-center'
              >
                {isSubmitting || loginUserResponse.isLoading ? 'Logging in...' : 'Submit'}
              </Button>
            </div>

            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1">
                Don't Have An Account?{" "}
                <Link className='font-semibold' to={'/register'}>
                  Register
                </Link>
              </p>
            </div>

            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1">
                Forget <Link className='font-semibold' to={'#'}>Password?</Link>
              </p>
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default Login