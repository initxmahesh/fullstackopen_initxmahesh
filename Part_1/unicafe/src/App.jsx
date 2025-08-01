import { useState } from 'react'
import Button from './Button'


const StatisticLine = (props) => {
  return (
      <p>{props.text} {props.value}</p>
  )
}

const Statistics = (props) => {
  let sum = 0;
  if (props.good || props.neutral || props.bad) {
    sum = props.good + props.neutral + props.bad
  }
  else return `No feedback given`

  return (
    <>
      <StatisticLine text="good" value ={props.good} />
      <StatisticLine text="neutral" value ={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={sum} />
      <StatisticLine text="average" value={(props.good - props.bad)/ sum} />
      <StatisticLine text="positive" value={`${(props.good/sum) * 100} %`} />
    </>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>give feedback</h1>
      <Button onclickFunc={() => { setGood(good + 1) }} text="good" />
      <Button onclickFunc={() => { setNeutral(neutral + 1) }} text="neutral" />
      <Button onclickFunc={() => { setBad(bad + 1) }} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App