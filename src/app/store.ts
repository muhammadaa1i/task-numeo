import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "../infra/users/repo.tkq";

export const store = configureStore({
    reducer: {
        [usersApi.reducerPath]: usersApi.reducer
    },
    middleware: (gdm) => gdm().concat(usersApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch