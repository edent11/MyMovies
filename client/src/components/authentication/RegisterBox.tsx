import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { useAuth, RegisterData } from '../../contexts/UserAuth'
import { useNavigate } from 'react-router-dom'
import LoadingButton from '../LoadingButton'

const UserBox: React.FC = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const [responseMessage, setResponseMessage] = useState('')

  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const [selectedAvatar, setSelectedAvatar] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isRegisterEnabled, setIsRegisterEnabled] = useState<boolean>(false)

  const [registerData, setRegisterData] = useState<RegisterData>({
    username: '',
    password: '',
    avatarImg: ''
  })

  const { data: avatars } = useSWR<string[]>(
    'http://localhost:5000/avatars',
    fetcher,
  )

  // Event handler to update form data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setRegisterData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  useEffect(() => {
    setRegisterData((prevState) => ({
      ...prevState,
      avatarImg: selectedAvatar?.toString() || '',
    }))
    console.log(registerData.avatarImg)
  }, [selectedAvatar])


  useEffect(() => {

    if (!registerData.username || !registerData.password || !registerData.avatarImg)
      setIsRegisterEnabled(false);
    else
      setIsRegisterEnabled(true);

  }, [registerData])

  // Event handler for form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true);
    // Do something with the form data, like submitting it to a server

    auth
      .register(registerData)
      ?.then(() => {
        navigate('/home')
        window.location.reload();
      })
      .catch((message) => setResponseMessage(message))
    setIsLoading(false);
  }

  return (
    <div
      id="signIn"
      className={`rounded-xl font-signika border-regular my-auto m-auto shadow-purple-600 shadow-lg border-white border-2
                       w-[600px] bg-gradient-to-br p-1 flex flex-col items-center font-bold
                        from-gray-200 to-gray-300 text-black dark:from-gray-700  dark:to-gray-800 dark:text-white`}
    >
      <p
        className={`bg-gradient-to-r animate-expand from-indigo-500 via-purple-500 to-purple-700 text-white 
            w-full text-center rounded-xl text-2xl`}
      >
        Register
      </p>

      <div className="mb-10">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col text-sm items-center justify-center gap-6 mt-10">
            <input
              className="text-black rounded-xl p-3 h-6 w-[24vw] max-w-[12rem] bg-opacity-10"
              type="text"
              placeholder="Username"
              name="username"
              value={registerData.username}
              onChange={handleInputChange}
              required
            />

            <input
              className="text-black  rounded-xl p-3 h-6 w-[24vw] max-w-[12rem] bg-opacity-10"
              type="password"
              placeholder="Password"
              name="password"
              value={registerData.password}
              onChange={handleInputChange}
              required
            />

            <div className="text-center">
              <p className="mb-4 text-[1.2rem]">Choose an avatar:</p>
              <div className="w-full flex flex-row gap-4">
                {isLoading ? (
                  <div>loading..</div>
                ) : (
                  avatars?.map((avatar, index) => (
                    <div key={index}>
                      <img
                        className={`size-10 rounded-3xl ring-purple-600 cursor-pointer
                                                 ${selectedAvatar == avatar ? 'ring-4' : 'ring-0'}`}
                        key={index}
                        src={`http://localhost:5000/avatars/${avatar}`}
                        alt=""
                        onClick={() => {
                          setSelectedAvatar(avatar);
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {responseMessage && (
              <p className="text-red-600">{responseMessage}</p>
            )}

            <LoadingButton

              isLoading={isLoading}
              isEnabled={isRegisterEnabled}
              buttonText='Register'
              className={`bg-gradient-to-r  text-[1rem] from-purple-500 to-purple-700
                         text-white hover:bg-gradient-to-l h-8 w-20 rounded-xl hover:bg-opacity-50`} />




          </div>
        </form>
      </div>

      <div className="">
        <div className="flex flex-row gap-4 items-center">
          <div className="logo-wrapper">
            <img
              className="size-8"
              src="https://developers.google.com/identity/images/g-logo.png"
            />
          </div>
          <span className="text-container">
            <span>Sign in with Google</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default UserBox
