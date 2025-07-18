import { connectDB } from "../src/lib/db"
import { Course, Module, Lesson } from "../src/lib/models"
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

/**
 * Read course metadata from content directory
 */
function getCourseMeta(courseSlug: string) {
  const metaPath = path.join(contentDirectory, 'courses', courseSlug, 'meta.json')
  
  if (!fs.existsSync(metaPath)) {
    throw new Error(`Course meta.json not found: ${metaPath}`)
  }

  const metaContent = fs.readFileSync(metaPath, 'utf8')
  return JSON.parse(metaContent)
}

/**
 * Read lesson content from MDX file
 */
function getLessonContent(courseSlug: string, moduleSlug: string, lessonSlug: string) {
  const lessonPath = path.join(
    contentDirectory,
    'courses',
    courseSlug,
    'modules',
    moduleSlug,
    'lessons',
    `${lessonSlug}.mdx`
  )

  if (!fs.existsSync(lessonPath)) {
    throw new Error(`Lesson file not found: ${lessonPath}`)
  }

  const fileContent = fs.readFileSync(lessonPath, 'utf8')
  const { data, content } = matter(fileContent)

  return {
    meta: data,
    content
  }
}

async function seed() {
  try {
    await connectDB()
    console.log("Connected to database")

    // Clear existing data
    await Course.deleteMany({})
    await Module.deleteMany({})
    await Lesson.deleteMany({})
    console.log("Cleared existing data")

    // Get course metadata
    const courseMeta = getCourseMeta('fundamentals-of-vibe-coding')
    
    console.log(`Processing course: ${courseMeta.title}`)

    // Create lessons and modules for each module in the course
    const createdModules = []
    
    for (const moduleData of courseMeta.modules) {
      console.log(`Processing module: ${moduleData.title}`)
      
      const createdLessons = []
      
      for (const lessonData of moduleData.lessons) {
        console.log(`Processing lesson: ${lessonData.title}`)
        
        try {
          // Read lesson content from MDX file
          const lessonContent = getLessonContent(
            courseMeta.slug,
            moduleData.slug,
            lessonData.slug
          )
          
          // Create lesson in database
          const lesson = await Lesson.create({
            title: lessonData.title,
            description: lessonData.description,
            slug: lessonData.slug,
            order: lessonData.order || 0,
            type: lessonData.type || 'lesson',
            content: lessonContent.content,
            resources: lessonContent.meta.resources || [],
            assignment: lessonContent.meta.assignment,
            isPublished: lessonData.isPublished !== false // Default to true unless explicitly false
          })
          
          createdLessons.push(lesson._id)
          console.log(`Created lesson: ${lesson.title}`)
          
        } catch (error) {
          console.error(`Error creating lesson ${lessonData.title}:`, error)
          // Continue with other lessons
        }
      }
      
      // Create module in database
      const courseModule = await Module.create({
        title: moduleData.title,
        description: moduleData.description,
        slug: moduleData.slug,
        order: moduleData.order || 0,
        lessons: createdLessons,
        estimatedHours: moduleData.estimatedHours || Math.ceil(createdLessons.length * 0.5)
      })
      
      createdModules.push(courseModule._id)
      console.log(`Created module: ${courseModule.title} with ${createdLessons.length} lessons`)
    }
    
    // Create the course
    const course = await Course.create({
      title: courseMeta.title,
      description: courseMeta.description,
      slug: courseMeta.slug,
      order: courseMeta.order || 0,
      isPublished: courseMeta.published || courseMeta.isPublished || false,
      modules: createdModules,
      estimatedHours: courseMeta.estimatedHours || Math.ceil(createdModules.length * 2),
      prerequisites: courseMeta.prerequisites || []
    })

    console.log("Seed data created successfully!")
    console.log(`Created course: ${course.title}`)
    console.log(`Created ${createdModules.length} modules`)
    
    // Count total lessons
    const totalLessons = await Lesson.countDocuments()
    console.log(`Created ${totalLessons} lessons`)

    process.exit(0)
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seed() 