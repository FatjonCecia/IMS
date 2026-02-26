import { ErrorMessage, Field, Formik } from 'formik'
import { Button } from 'primereact/button'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

const Register = () => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  type User = {
    name: string
    email: string
    password: string
  }

  const initialValues: User = {
    name: '',
    email: '',
    password: '',
  }

  const validationSchema = yup.object({
    name: yup
      .string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: yup
      .string()
      .email("Email must be valid")
      .required("Email is required"),
    password: yup
      .string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required"),
  })

  const onSubmitHandler = async (values: User, { resetForm }: any) => {
    try {
      setServerError(null)

      // Simulated registration
      console.log('Registered User:', values)

      // Save fake token
      localStorage.setItem('token', 'fake-token-123')

      resetForm()
      navigate('/dashboard')
    } catch (error: any) {
      setServerError(error?.message || 'Registration failed')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-[#eee]'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
      >
        {({ handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="w-[96%] md:w-[70%] lg:w-1/3 shadow-md rounded-md pt-10 pb-3 px-4 bg-white"
          >

            {/* Name */}
            <div className="mb-3 py-1">
              <label htmlFor="name">Full Name</label>
              <Field
                id='name'
                name='name'
                className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
                placeholder='Enter your full name'
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm' name='name' />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="mb-3 py-1">
              <label htmlFor="password">Password</label>
              <Field
                id='password'
                name='password'
                type='password'
                className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
                placeholder='*****'
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm' name='password' />
            </div>

            {serverError && (
              <div className="mb-3 text-red-500 text-sm">
                {serverError}
              </div>
            )}

            <div className="mb-3 py-1">
              <Button
                raised
                type='submit'
                className='w-full bg-red-500 text-white py-3 px-2 flex items-center justify-center'
              >
                Register
              </Button>
            </div>

            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1">
                Already have an account?{" "}
                <Link className='font-semibold' to={'/login'}>
                  Login
                </Link>
              </p>
            </div>

          </form>
        )}
      </Formik>
    </div>
  )
}

export default Register