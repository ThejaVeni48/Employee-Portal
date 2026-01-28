import AppRoutes from "./AppRoutes";
import store from "./Redux/Store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";


function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <>
          <Toaster position="top-right" />

          <div className="font-sans min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </>
      </Provider>
    </QueryClientProvider>
  );
}


export default App;