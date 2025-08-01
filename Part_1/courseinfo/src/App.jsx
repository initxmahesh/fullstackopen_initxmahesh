const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Header = ({course}) => {
    console.log(course)
    return (
      <>
        <h1>{course}</h1>
      </>
    )
  }

  const Content = ({parts}) => {
    console.log(parts)
    return (
      <>
        <Part part={parts[0]} />
        <Part part={parts[1]} />
        <Part part={parts[2]} />
      </>
    )
  }

  const Part = ({part}) => {
    console.log(part)
    return (
      <p>{part.name} {part.exercises}</p>
    )
  }

  const Total = ({parts}) => {
    console.log(parts)
    return (
      <p> Number of exercises {parts[0].exercises+parts[1].exercises+parts[2].exercises} </p>
    )
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App