import React, { useEffect, useState } from 'react'
import { useFetcher } from 'react-router-dom'
import useSWR, { mutate } from 'swr'

import { ThoughtType } from './shared/types/ThoughtTypes'
import { fetcher } from './shared/utils'
import Thought from './card/Thought'


type Props = {
  session_token?: string
}

const ThoughtsList: React.FC<Props> = ({ session_token }) => {


  const { data: thoughtsList, isLoading, error } = useSWR<ThoughtType[]>
    (`http://localhost:5000/thoughts/${session_token ? session_token : ''}`, fetcher)

  if (error) {
    return <div>Error loading user profiles</div>
  }

  if (!thoughtsList) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-5 h-[90%] mb-10">
      {thoughtsList
        .sort((a: ThoughtType, b: ThoughtType) => {
          var date_a = new Date(a.createdAt).getMilliseconds();
          var date_b = new Date(b.createdAt).getMilliseconds();
          return date_b - date_a;
        })
        .map((thought) => {
          return <Thought thought={thought} key={thought._id} />
        })}
    </div>
  )
}

export default ThoughtsList
