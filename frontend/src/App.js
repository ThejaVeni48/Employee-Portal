import AppRoutes from "./AppRoutes";
import store from "./Redux/Store";
import { Provider } from "react-redux";


function App() {

   
 
  return (
    <Provider store={store}>
      <AppRoutes/>
    </Provider>
  );
}

export default App;