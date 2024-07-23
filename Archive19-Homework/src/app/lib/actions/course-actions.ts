"use server"

import { createWriteStream } from "fs"
import { InputCourse, InputModule, addCourse, addModule, updateCourseById } from "../api"
import { redirect } from "next/navigation"

export const handleAdd = async (prev:unknown, data:FormData) => {
   
   if(!data.get("name") || !data.get("price") || !data.get("duration") || !data.get("cover")){
      return{
         message: "Please fill all the filed!",
         name:data.get("name"),
         price: data.get("price"),
         duration: data.get("duration")
         
         
      }
   }else if(isNaN(Number(data.get("duration")))){
      return{
         message: "duration must be a number!",
         name:data.get("name"),
         price: data.get("price")
      }
   }else if(isNaN(Number(data.get("price")))){
      return{
         message: "price must be a number!",
         name:data.get("name"),
         duration: data.get("duration") 
      }
   }
   
   const photo = data.get('cover') as File
   if(photo){
     let extension = photo.type.split("/").at(-1)
     const filename =  Date.now() + "." + extension
    
     const stream = createWriteStream("public/images/" + filename)

     const bufferedImage = await photo.arrayBuffer()

     stream.write(Buffer.from(bufferedImage))

     let course:InputCourse = {
        name: data.get('name') as string,
        price: +(data.get('price') as string),
        duration: +(data.get('duration') as string),
        cover: 'images/' + filename
     }

     addCourse(course)
     redirect("/")

   }
}

export const handleUpdate = async (id:number, data:FormData) => {

   const course:Partial<InputCourse> = {
      name: data.get("name") as string,
      price: +(data.get("price") as string),
      duration: +(data.get('duration') as string)
   }

   const photo = data.get('cover') as File
   if(photo.size > 0){
      let extension = photo.type.split("/").at(-1)
      const filename =  Date.now() + "." + extension
    
      const stream = createWriteStream("public/images/" + filename)

      const bufferedImage = await photo.arrayBuffer()
      course.cover = 'images/' + filename
      stream.write(Buffer.from(bufferedImage))

   }
   updateCourseById(id, course)
   redirect("/courses")
}

export const handleAddModule = (data:FormData) =>{
   let module:InputModule = {
      title: data.get("title") as string,
      duration: +(data.get("duration") as string),
      courseId: +(data.get("courseId") as string)
   }
   let resulte = addModule(module)
   console.log(resulte);
   redirect("/courses")
}