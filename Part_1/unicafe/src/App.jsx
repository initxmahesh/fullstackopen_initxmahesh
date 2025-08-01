import { useState } from 'react'
import Button from './Button'


const StatisticLine = (props) => {
  return (
      <tr>
        <td>{props.label}</td>
        <td>{props.value}</td>
      </tr>
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
      <table>
        <tbody>
          <StatisticLine label="good" value ={props.good} />
          <StatisticLine label="neutral" value ={props.neutral} />
          <StatisticLine label="bad" value={props.bad} />
          <StatisticLine label="all" value={sum} />
          <StatisticLine label="average" value={(props.good - props.bad)/ sum} />
          <StatisticLine label="positive" value={`${(props.good/sum) * 100} %`} />
        </tbody>
      </table>
    </>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>give feedback</h1>
      <Button onclickFunc={() => { setGood(good + 1) }} label="good" />
      <Button onclickFunc={() => { setNeutral(neutral + 1) }} label="neutral" />
      <Button onclickFunc={() => { setBad(bad + 1) }} label="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App