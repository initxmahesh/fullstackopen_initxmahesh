import { createSlice } from "@reduxjs/toolkit";

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const generateId = () => Number((Math.random() * 1000000).toFixed(0));

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: generateId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

// const voteAnecdote = (id) => {
//   return {
//     type: "VOTE",
//     payload: id,
//   };
// };

// const newAnecdote = (content) => {
//   return {
//     type: "NEW_ANECDOTE",
//     payload: {
//       content,
//       id: generateId(),
//       votes: 0,
//     },
//   };
// };

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "VOTE": {
//       const id = action.payload;
//       return state.map((anecdote) =>
//         anecdote.id === id
//           ? { ...anecdote, votes: anecdote.votes + 1 }
//           : anecdote
//       );
//     }
//     case "NEW_ANECDOTE": {
//       return [...state, action.payload];
//     }
//     default:
//       return state;
//   }
// };

// export { reducer, voteAnecdote, newAnecdote };

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id === action.payload
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      );
    },
    newAnecdote(state, action) {
      return state.concat(action.payload);
    },
  },
});

export const { voteAnecdote, newAnecdote } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
