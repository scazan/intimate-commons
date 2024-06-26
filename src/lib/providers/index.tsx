import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
