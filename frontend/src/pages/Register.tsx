import { ErrorMessage, Field, Formik } from 'formik'
import { Button } from 'primereact/button'
import { useNavigate, Link } from 'react-router-dom'
import * as yup from 'yup'
import { useRegisterUserMutation } from '../provider/queries/Auth.query'

const Register = () => {

  const [registerUser, registerUserResponse] = useRegisterUserMutation()
  const navigate = useNavigate()

  type User = {
    name: string,
    email: string,
    password: string
  }

  const initialValues: User = {
    name: '',
    email: '',
    password: ''
  }

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Email must be valid").required("Email is required"),
    password: yup
      .string()
      .min(5, "Password must be greater than 5 characters")
      .required("Password is required"),
  })

  const OnSubmitHandler = async (values: User, { resetForm }: any) => {
    try {
      const { data, error }: any = await registerUser(values)

      if (error) {
        alert(error.data.message) // show error as alert
        return
      }

      localStorage.setItem("token", data.token)
      resetForm()
      navigate("/") // redirect to home/dashboard

    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-[#eee]'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={OnSubmitHandler}
      >
        {({ handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="w-[96%] md:w-[70%] lg:w-1/3 shadow-md rounded-md pt-10 pb-3 px-4 bg-white"
          >

            <div className="mb-3 py-1">
              <label htmlFor="name">Name</label>
              <Field
                id='name'
                name='name'
                className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
                placeholder='Enter Name'
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm' name='name' />
            </div>

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
                name='password'
                id='password'
                type="password"
                className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
                placeholder='*****'
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm' name='password' />
            </div>

            <div className="mb-3 py-1">
              <Button
                loading={registerUserResponse.isLoading}
                raised
                type='submit'
                className='w-full bg-red-500 text-white py-3 px-2 flex items-center justify-center'
              >
                Submit
              </Button>
            </div>

            {/* ✅ Login link below */}
            <div className="mt-4 text-center">
              <p>
                Already have an account?{' '}
                <Link to="/login" className='text-blue-500 font-semibold'>
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