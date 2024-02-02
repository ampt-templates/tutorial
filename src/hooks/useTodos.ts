import { useCallback, useState } from "react";
import useSWR, { KeyedMutator } from "swr";
import { apiClient } from "../utility/api";

export type TodoItem = {
  id: string;
  name: string;
  description?: string;
  status: "complete" | "incomplete";
};

type Toggle = (id: string) => Promise<void>;

export function useTodos(): {
  todos: TodoItem[];
  toggle: Toggle;
  refresh: KeyedMutator<TodoItem[]>;
  loading: { [id: string]: boolean };
} {
  const [loading, setLoading] = useState({});
  const { mutate, data: todos = [] } = useSWR<TodoItem[]>("/todos", (url) =>
    apiClient({ url })
  );

  const toggle = useCallback(
    async (id: string) => {
      setLoading({ ...loading, [id]: true });
      await apiClient({
        url: `/todos/${id}`,
        method: "PATCH",
      });
      setLoading({ ...loading, [id]: false });
    },
    [loading, setLoading]
  );

  return { todos, refresh: mutate, toggle, loading };
}
