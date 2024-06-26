import React, { useEffect, useState } from 'react'
import { User } from '../../contexts/UserAuth'
import { calcTimePassed } from '../shared/utils'
import { CommentType } from '../shared/types/ThoughtTypes'

interface Props {
  comment: CommentType
  className?: string
  childRef?: React.RefObject<HTMLDivElement>
}

const Comment: React.FC<Props> = ({ comment, className, childRef }) => {

  const [lineClamp, setLineClamp] = useState<number>(3);
  const [postTime, setPostTime] = useState<string>(calcTimePassed(comment.createdAt));


  useEffect(() => {

    setLineClamp(3);
  }, []); // Run once after mounting




  return (
    <div
      id="commentBox"
      ref={childRef}
      className={`bg-gray-100 text-black divide-y-2 divide-transparent
         p-2 dark:bg-gray-600 dark:text-white shadow-lg rounded-3xl w-[95%] ${className}`}>

      <div
        id="userArea"
        className=" rounded-3xl p-1 select-none flex flex-row gap-2 items-center">

        <img
          className="rounded-full size-8 ring-white ring-2"
          src={comment.user.avatar}
          alt=""
        />

        <p className=" select-none light:text-black font-bold dark:text-purple-300">
          {comment.user.username}
        </p>

        <label className=" select-none light:text-gray-700 opacity-60 text-sm">
          {postTime.toString()}
        </label>

      </div>
      <div id="comment-txt-wrapper" className="ml-8 w-[90%]">
        <p
          id="comment-txt"
          className={`break-words cursor-pointer line-clamp-${lineClamp} cursor-text`}
          onClick={() => setLineClamp(prev => prev + 2)}>

          <div className='space-x-2 '>
            {
              comment.tags.map((user: { 'username': string }, _) => {

                console.log(user)
                return (
                  <span key={user.username} className='text-blue-500 rounded-sm bg-gray-300 cursor-pointer' >@{user.username}</span>
                )
              })
            }
          </div>
          {comment.text}

        </p>
      </div>
    </div>
  )
}

export default Comment
