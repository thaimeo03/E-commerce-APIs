import Category from '~/models/database/Category'
import databaseService from './database.service'

class CategoryService {
  async createCategory(name: string) {
    await databaseService.categories.insertOne(new Category({ name }))
  }
}

const categoryService = new CategoryService()
export default categoryService
