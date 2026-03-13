const Header = ({course}) => <h1>{course}</h1>

const Content = ({parts}) => (
  <div>
    {
      parts.map((p)=>{
        return(
          <Part key={p.id} part={p} />
        )
      })
    }
  </div>
)

const Part = ({part}) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Total = ({total}) => <p>Number of exercises {total}</p>

const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={course.parts.reduce((sum, part) => sum + part.exercises, 0)} />
    </>
  )
}

export default Course
