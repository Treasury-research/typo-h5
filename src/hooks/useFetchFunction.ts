import useSWR from 'swr'

export function useFetchFunction<T>(
  func: ((options: any) => any) | undefined | null,
  params?: Record<string, any> | string,
  options?: Record<string, any>
) {
  const res = useSWR<T>(
    func ? `${func.name || func.toString()}_${
      typeof params === 'string' ? params : JSON.stringify(params)
    }` : func,
    () => func ? func(params) : null,
    options
  );

  const { data, error } = res;
  return {
    data,
    loading: !error && !data,
    error,
  };
}
