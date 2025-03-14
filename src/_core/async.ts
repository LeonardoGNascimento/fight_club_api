type Result<T> = [T, null] | [null, Error];

export async function async<T = any>(f: any): Promise<Result<T>> {
  try {
    const result = await f;

    return [result, null];
  } catch (error) {
    return [null, error];
  }
}

export const asyncFunction: <T = any>(f: any) => Promise<Result<T>> = async;
