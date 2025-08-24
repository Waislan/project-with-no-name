export default class IRepository {
  constructor() {
    this.data = [];
  }

  async findAll() {
    return this.data;
  }

  async findById(id) {
    return this.data.find(item => item.id === id);
  }

  async save(data) {
    this.data.push(data);
    return data;
  }

  async update(id, data) {
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...data };
      return this.data[index];
    }
    return null;
  }

  async delete(id) {
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      return this.data.splice(index, 1)[0];
    }
    return null;
  }
}
