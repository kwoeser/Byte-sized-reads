import React from 'react'

type Props = {}

const topics = [
    { value: "politics", label: "Politics" },
    { value: "technology", label: "Technology" },
    { value: "philosophy", label: "Philosophy" },
    { value: "health", label: "Health" },
]


const Filter = (props: Props) => {
  return (
    <div>
      <h2>Filters</h2>
    </div>
  )
}

export default Filter