import Category from '~/models/database/Category'
import databaseService from './database.service'
import { ObjectId } from 'mongodb'

class CategoryService {
  async createCategory(name: string) {
    await databaseService.categories.insertOne(new Category({ name }))
  }

  async deleteCategory(category_id: string) {
    await databaseService.categories.deleteOne({ _id: new ObjectId(category_id) })
  }

  async updateCategory(name: string) {
    const result = await databaseService.categories.findOneAndUpdate(
      { name },
      {
        $set: { name },
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after'
      }
    )

    return result.value
  }
}

const categoryService = new CategoryService()
export default categoryService
