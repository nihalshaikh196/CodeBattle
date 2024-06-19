
import AppRoutes from "./routes/route";
import { UserContextProvider } from "./contexts/user";
function App() {
  return (
    <>
    <UserContextProvider>
      <AppRoutes />       
   </UserContextProvider>
  </>
  );
}

export default App;
