import { baseApi } from './baseApi'

export enum JournalEntryType {
  NOTE = 'NOTE',
  TASK = 'TASK',
  TOPIC = 'TOPIC',
  IDEA = 'IDEA',
}

export interface JournalEntry {
  id: string
  title: string
  content: any // TipTap JSON content
  type: JournalEntryType
  folder?: {
    id: string
    name: string
    color?: string
    icon?: string
  }
  tags: Array<{
    id: string
    name: string
    color?: string
  }>
  isPinned: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface JournalFolder {
  id: string
  name: string
  color?: string
  icon?: string
  parentId?: string
  parent?: {
    id: string
    name: string
  }
  children?: Array<{
    id: string
    name: string
    color?: string
    icon?: string
  }>
  entriesCount: number
  createdAt: string
}

export interface JournalTag {
  id: string
  name: string
  color?: string
  entriesCount: number
  createdAt: string
}

export interface CreateJournalEntryRequest {
  title: string
  content: any
  type?: JournalEntryType
  folder_id?: string
  tag_ids?: string[]
}

export interface UpdateJournalEntryRequest {
  title?: string
  content?: any
  type?: JournalEntryType
  folder_id?: string | null
  tag_ids?: string[]
}

export interface CreateJournalFolderRequest {
  name: string
  color?: string
  icon?: string
  parent_id?: string
}

export interface UpdateJournalFolderRequest {
  name?: string
  color?: string
  icon?: string
  parent_id?: string | null
}

export interface CreateJournalTagRequest {
  name: string
  color?: string
}

export interface UpdateJournalTagRequest {
  name?: string
  color?: string
}

export interface GetJournalEntriesParams {
  type?: JournalEntryType
  folder_id?: string
  tag_id?: string
  search?: string
  is_pinned?: boolean
  is_archived?: boolean
}

export const journalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJournalEntries: builder.query<JournalEntry[], GetJournalEntriesParams>({
      query: (params) => {
        // Убираем undefined значения из параметров
        // Axios автоматически преобразует boolean в строку для query параметров, но лучше явно преобразовать
        const cleanParams: Record<string, string> = {}
        if (params.type) cleanParams.type = params.type
        if (params.folder_id) cleanParams.folder_id = params.folder_id
        if (params.tag_id) cleanParams.tag_id = params.tag_id
        if (params.search) cleanParams.search = params.search
        if (params.is_pinned !== undefined) cleanParams.is_pinned = String(params.is_pinned)
        if (params.is_archived !== undefined) cleanParams.is_archived = String(params.is_archived)

        return {
          url: '/journal/entries',
          params: cleanParams,
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'JournalEntry' as const, id })), { type: 'JournalEntry', id: 'LIST' }]
          : [{ type: 'JournalEntry', id: 'LIST' }],
    }),
    getJournalEntry: builder.query<JournalEntry, string>({
      query: (id) => `/journal/entries/${id}`,
      providesTags: (result, error, id) => [{ type: 'JournalEntry', id }],
    }),
    createJournalEntry: builder.mutation<JournalEntry, CreateJournalEntryRequest>({
      query: (data) => ({
        url: '/journal/entries',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'JournalEntry', id: 'LIST' },
        { type: 'JournalFolder', id: 'LIST' },
        { type: 'JournalTag', id: 'LIST' },
      ],
    }),
    updateJournalEntry: builder.mutation<JournalEntry, { id: string; data: UpdateJournalEntryRequest }>({
      query: ({ id, data }) => ({
        url: `/journal/entries/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'JournalEntry', id },
        { type: 'JournalEntry', id: 'LIST' },
      ],
    }),
    deleteJournalEntry: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/journal/entries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'JournalEntry', id },
        { type: 'JournalEntry', id: 'LIST' },
      ],
    }),
    togglePinEntry: builder.mutation<{ isPinned: boolean }, string>({
      query: (id) => ({
        url: `/journal/entries/${id}/pin`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'JournalEntry', id },
        { type: 'JournalEntry', id: 'LIST' },
      ],
    }),
    toggleArchiveEntry: builder.mutation<{ isArchived: boolean }, string>({
      query: (id) => ({
        url: `/journal/entries/${id}/archive`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'JournalEntry', id },
        { type: 'JournalEntry', id: 'LIST' },
      ],
    }),
    getJournalFolders: builder.query<JournalFolder[], void>({
      query: () => '/journal/folders',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'JournalFolder' as const, id })), { type: 'JournalFolder', id: 'LIST' }]
          : [{ type: 'JournalFolder', id: 'LIST' }],
    }),
    createJournalFolder: builder.mutation<JournalFolder, CreateJournalFolderRequest>({
      query: (data) => ({
        url: '/journal/folders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'JournalFolder', id: 'LIST' }],
    }),
    updateJournalFolder: builder.mutation<JournalFolder, { id: string; data: UpdateJournalFolderRequest }>({
      query: ({ id, data }) => ({
        url: `/journal/folders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'JournalFolder', id },
        { type: 'JournalFolder', id: 'LIST' },
      ],
    }),
    deleteJournalFolder: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/journal/folders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'JournalFolder', id },
        { type: 'JournalFolder', id: 'LIST' },
        { type: 'JournalEntry', id: 'LIST' },
      ],
    }),
    getJournalTags: builder.query<JournalTag[], void>({
      query: () => '/journal/tags',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'JournalTag' as const, id })), { type: 'JournalTag', id: 'LIST' }]
          : [{ type: 'JournalTag', id: 'LIST' }],
    }),
    createJournalTag: builder.mutation<JournalTag, CreateJournalTagRequest>({
      query: (data) => ({
        url: '/journal/tags',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'JournalTag', id: 'LIST' }],
    }),
    updateJournalTag: builder.mutation<JournalTag, { id: string; data: UpdateJournalTagRequest }>({
      query: ({ id, data }) => ({
        url: `/journal/tags/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'JournalTag', id },
        { type: 'JournalTag', id: 'LIST' },
      ],
    }),
    deleteJournalTag: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/journal/tags/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'JournalTag', id },
        { type: 'JournalTag', id: 'LIST' },
        { type: 'JournalEntry', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetJournalEntriesQuery,
  useGetJournalEntryQuery,
  useCreateJournalEntryMutation,
  useUpdateJournalEntryMutation,
  useDeleteJournalEntryMutation,
  useTogglePinEntryMutation,
  useToggleArchiveEntryMutation,
  useGetJournalFoldersQuery,
  useCreateJournalFolderMutation,
  useUpdateJournalFolderMutation,
  useDeleteJournalFolderMutation,
  useGetJournalTagsQuery,
  useCreateJournalTagMutation,
  useUpdateJournalTagMutation,
  useDeleteJournalTagMutation,
} = journalApi
