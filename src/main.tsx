import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './redux/store/store.ts'
import {Provider} from 'react-redux'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient=new QueryClient({
  defaultOptions:{
    queries:{
      retry: 1,
      refetchOnWindowFocus:false
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>

<QueryClientProvider client={queryClient}>
     <Provider store={store}>
       <App />
       </Provider>
   </QueryClientProvider>
  </StrictMode>,
)
