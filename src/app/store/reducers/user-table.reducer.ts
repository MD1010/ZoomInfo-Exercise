import { createEntityAdapter, Dictionary, EntityAdapter, EntityState } from '@ngrx/entity';
import { User } from 'src/app/models/user.model';
import { LOAD_PAGE, LOAD_PAGE_FAIL, LOAD_PAGE_SUCCESS, UsersTableActions } from '../actions';

export interface UsersTableState extends EntityState<User> {
  isLoading: boolean;
  usersByPage: Dictionary<User[]>;
  error: string | null;
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>();
const initialState: UsersTableState = usersAdapter.getInitialState({
  entities: {},
  ids: [],
  usersByPage: {},
  isLoading: false,
  error: null,
});

export const usersTableReducer = (state = initialState, action: UsersTableActions): UsersTableState => {
  switch (action.type) {
    case LOAD_PAGE:
      return { ...state, isLoading: true };
    case LOAD_PAGE_FAIL:
      return { ...state, isLoading: false, usersByPage: {}, error: action.payload };
    case LOAD_PAGE_SUCCESS:
      const { content, pageSize, pageNumber } = action.payload;
      const pageContent = content.length > pageSize ? content.slice(0, pageSize) : content;
      return usersAdapter.addMany(content, {
        ...state,
        usersByPage: { ...state.usersByPage, [pageNumber]: pageContent },
      });

    default:
      return state;
  }
};
