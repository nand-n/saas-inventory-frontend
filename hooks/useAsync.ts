import { runAsync } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";

export function useAsync<Args extends any[], ReturnType>(
  asyncFunction: (...args: Args) => Promise<ReturnType>,
  immediate = false,
  ...args: Args
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ReturnType | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    const [result, error] = await runAsync(asyncFunction, ...args );

    if (error) {
      setError(error);
    } else {
      setData(result
        );
    }

    setLoading(false);
  }, [asyncFunction, ...args]);

  // Automatically run if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return { execute, data, error, loading };
}
