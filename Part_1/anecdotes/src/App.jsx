import { useState } from 'react'

const Button = ({nextanecdotes}) => {
  return (
    <button onClick={nextanecdotes}>next anecdotes</button>
  )
}

const Button1 = ({voteBtn}) => {
  return (
    <button onClick={voteBtn}>vote</button>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array.from({ length: anecdotes.length }, () => 0));
  const maxVoted = Math.max(...votes)
  const mostVoted = votes.indexOf(maxVoted)

  return (
    <>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}<br />

      <Button1 voteBtn={() => {
        const latestVote = [...votes]
        latestVote[selected] += 1;
        setVotes(latestVote)
      }} />
      
      <Button nextanecdotes={() => { setSelected(Math.floor(Math.random() * anecdotes.length)) }} />
      <br />
      <span> has {votes[selected]} votes.</span>
      <h1>Anecdotes with most votes</h1>
      <span>{anecdotes[mostVoted]}</span><br />
      <span>has {votes[mostVoted]} votes.</span>
    </>
  )
}

export default App