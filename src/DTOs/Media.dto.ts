export interface IPostMediaDto {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  updatedAt?: Date;
}
export interface IUpdateMediaDto extends Partial<IPostMediaDto> {}
