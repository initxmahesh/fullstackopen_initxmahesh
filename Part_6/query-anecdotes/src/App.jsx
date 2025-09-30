import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, updateAnecdote } from "./service/anecdotes";
import { useNotification } from "./components/NotificationContext";

const App = () => {
  const queryClient = useQueryClient();
  const [, dispatch] = useNotification();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      dispatch({ type: "SHOW", payload: `anecdote '${data.content}' voted` });
      setTimeout(() => {
        dispatch({ type: "HIDE" });
      }, 5000);
    },
  });

  if (isLoading) {
    return <div>loading data...</div>;
  }

  if (isError) {
    return <div>Error loading data...</div>;
  }

  const anecdotes = data;

  const handleVote = (anecdote) => {
    voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    console.log("vote");
  };

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
