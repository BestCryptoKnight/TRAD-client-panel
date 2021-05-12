import { Provider } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import Notifications from 'react-notify-toast';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStoreData, store } from './redux/store';
import Routes from './routes/Routes';

function App() {
  return (
    <Provider store={store}>
      <Notifications />
      <PersistGate loading={null} persistor={persistStoreData}>
        <Routes />
        <Notifications />
      </PersistGate>
    </Provider>
  );
}

export default App;
