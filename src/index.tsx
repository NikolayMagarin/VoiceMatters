import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <AlertProvider template={AlertTemplate} timeout={5000}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlertProvider>
    </QueryClientProvider>
  </AuthProvider>
);
