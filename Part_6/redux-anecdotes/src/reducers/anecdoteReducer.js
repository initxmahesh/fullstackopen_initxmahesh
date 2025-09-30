import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

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
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },
    newAnecdote(state, action) {
      state.push(action.payload);
    },
    voteAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id === action.payload.id ? action.payload : anecdote
      );
    },
  },
});

// const anecdoteSlice = createSlice({
//   name: "anecdotes",
//   initialState,
//   reducers: {
//     voteAnecdote(state, action) {
//       const id = action.payload;
//       const anecdoteToChange = state.find((a) => a.id === id);
//       if (anecdoteToChange) {
//         anecdoteToChange.votes += 1;
//       }
//     },
//     newAnecdote(state, action) {
//       state.push({
//         content: action.payload,
//         id: generateId(),
//         votes: 0,
//       });
//     },
//   },
// });

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const createdAnecdote = await anecdoteService.createAnecdote(content);
    dispatch(newAnecdote(createdAnecdote));
  };
};

export const voteAnecdoteTk = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.voteAnecdote(anecdote);
    dispatch(voteAnecdote(updatedAnecdote));
  };
};

export const { setAnecdotes, voteAnecdote, newAnecdote } =
  anecdoteSlice.actions;
export default anecdoteSlice.reducer;
