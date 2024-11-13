import { PaginationResult } from '../helpers/modelInterface';

export async function paginate(
  dto: any,
  model: any,
): Promise<PaginationResult> {
  const pageSize = dto.pageSize ? dto.pageSize : 10;

  const pageNumber = dto.page ? dto.page : 1;

  const skip = (pageNumber - 1) * pageSize;

  const totalItemCount = await model.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  return {
    pageSize,
    totalRecordsCount: totalItemCount,
    currentPage: pageNumber,
    totalPages,
    skip,
    limit: pageSize,
  };
}
