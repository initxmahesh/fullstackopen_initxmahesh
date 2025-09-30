import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../service/anecdotes";
import { useNotification } from "./NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const [, dispatch] = useNotification();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      dispatch({ type: "SHOW", payload: `anecdote '${data.content}' created` });
      setTimeout(() => {
        dispatch({ type: "HIDE" });
      }, 5000);
    },
    onError: (error) => {
      dispatch({ type: "SHOW", payload: error.response.data.error });
      setTimeout(() => {
        dispatch({ type: "HIDE" });
      }, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    newAnecdoteMutation.mutate({ content, votes: 0 });
    event.target.anecdote.value = "";
    console.log("new anecdote");
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
