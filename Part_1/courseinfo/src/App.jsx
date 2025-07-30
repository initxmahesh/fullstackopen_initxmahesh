const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  const Header = (props) => {
    return (
      <>
        <h1>{props.course}</h1>
      </>
    )
  }

  const Content = (props) => {
    return (
      <>
        <Part part={props.part1} exercises={props.exercise1} />
        <Part part={props.part2} exercises={props.exercise2} />
        <Part part={props.part3} exercises={props.exercise3} />
      </>
    )
  }

  const Part = (props) => {
    return (
      <p>{props.part} {props.exercises}</p>
    )
  }

  const Total = (props) => {
    return (
      <p> {props.tots} {props.total} </p>
    )
  }

  return (
    <div>
      <Header course={course} />
      <Content part1={part1} exercise1={exercises1} part2={part2} exercise2={exercises2} part3={part3} exercise3={exercises3} />
      <Total tots = 'Number of exercise' total={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App