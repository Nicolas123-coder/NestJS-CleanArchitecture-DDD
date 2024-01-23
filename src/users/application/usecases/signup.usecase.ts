export namespace SignupUseCase {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = {
    id: string
    name: string
    email: string
    // NÁO COLOQUEI O CAMPO password COMO ELE POS NO VIDEO...
    createdAt: Date
  }

  export class UseCase {
    async execute(input: Input): Promise<Output> {}
  }
}
