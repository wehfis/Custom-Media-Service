export default interface IRepository<Model> {
  findById(id: string): Promise<Model | false>;
  findAll(): Promise<Model[]>;
  create(payload: unknown): Promise<Model>;
  update(id: string, payload: unknown): Promise<Model | false>;
  delete(id: string): Promise<boolean>;
}
