import Database from 'better-sqlite3'

export interface ICourse {
    id: number
    name: string
    price: number
    cover: string
    duration: number
    modules?: IModule[]
}

export type InputCourse = Omit<ICourse, 'id'>
const db = new Database("courses.db")

export const addCourse = (course: InputCourse) => {
    db.prepare(`
            INSERT INTO courses(name, price, cover, duration)
            VALUES(@name, @price, @cover, @duration)
    `).run(course)
}

export const getAllCourses = (): ICourse[] => {
    const courses = db.prepare('SELECT * FROM courses').all() as ICourse[];
    return courses.map(course => ({
      ...course,
      modules: db.prepare('SELECT * FROM modules WHERE courseId = ?').all(course.id) as IModule[]
    }));
  };
  
export const getCourseById = (id: number): ICourse => {
    return db.prepare(`SELECT * FROM courses where id = ?`).get(id) as ICourse
}

export const updateCourseById = (id: number, body: Partial<InputCourse>) => {
    if (!body.cover) {
        return db
            .prepare(` UPDATE courses set name=?, price=?, duration=? WHERE id = ?`)
            .run(body.name, body.price, body.duration, id)
    } else {
        return db
            .prepare(` UPDATE courses set name=?, price=?, duration=?, cover=? WHERE id = ?`)
            .run(body.name, body.price, body.duration, body.cover, id)
    }
}

export interface IModule{
    id: number
    title: string
    duration: number
    courseId:number
}

export type InputModule = Omit<IModule, 'id'>

export const addModule = (obj:InputModule):Database.RunResult =>{
    return db.prepare(`
        INSERT INTO modules(title, duration, courseId)
        VALUES(@title, @duration, @courseId)
    `).run(obj)
}