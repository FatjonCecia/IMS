import { ErrorMessage, Field, Formik } from 'formik'
import { Button } from 'primereact/button'
import { useNavigate, Link } from 'react-router-dom'
import * as yup from 'yup'

const Login = () => {
  const navigate = useNavigate()

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

  const onSubmitHandler = (values: User) => {
    // Simulate a login check
    if (values.email === 'test@example.com' && values.password === '12345') {
      alert('Login successful!')
      localStorage.setItem('token', 'fake-token-123') // save a fake token
      navigate('/dashboard') // redirect to dashboard
    } else {
      alert('Invalid email or password')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-[#eee]'>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmitHandler}>
        {({ handleSubmit, isValid, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="w-[96%] md:w-[70%] lg:w-1/3 shadow-md rounded-md pt-10 pb-3 px-4 bg-white">
            
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
                placeholder='*****'
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm' name='password' />
            </div>

            <div className="mb-3 py-1 flex items-center justify-center">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className='w-full bg-red-500 text-white py-3 px-2 flex items-center justify-center'
              >
                Submit
              </Button>
            </div>

            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1">
                Don't Have An Account? <Link className='font-semibold' to={'/register'}>Register</Link>
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