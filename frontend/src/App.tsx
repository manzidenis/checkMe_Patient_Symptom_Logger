import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { UIProvider } from './context/UIContext'
import AppRoutes from './routes/AppRoutes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UIProvider>
          <AppRoutes />
        </UIProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
